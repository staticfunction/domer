/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="resources/htmlparser2.d.ts"/>

/**
 * Created by jcabresos on 5/19/2014.
 */
import templates = require('./templates');
import fs = require('graceful-fs');
import htmlparser = require('htmlparser2');

export interface HtmlTagInfo {
    interface: string;
    obsolete: boolean;
    alternative: string;
}

export class UniqueHtmlElement {

    elementId:string;
    elementInterface:string;

    constructor(elementId:string, elementInterface:string) {
        this.elementId = elementId;
        this.elementInterface = elementInterface;
    }
}

class UniqueHtmlElementFactory {

    htmlRef:{[type:string]:HtmlTagInfo};

    constructor() {
        this.htmlRef = JSON.parse(fs.readFileSync(__dirname + "/resources/htmlref.json", "UTF-8")); //TODO: externalize the loading.
    }

    newInstance(elementId:string, elementType:string):UniqueHtmlElement {
        var elementInfo:HtmlTagInfo = this.htmlRef[elementType];

        if(!elementInfo)
            throw new Error("Unrecognized elementType: " + elementType);

        return new UniqueHtmlElement(elementId, elementInfo.interface);
    }
}


export class DomInstructions {

    createInstructions:string[];
    uniqueElements:UniqueHtmlElement[];
    domTemplates:templates.DomInstructionTemplates;
    elementsStack:string[];
    elementsLength:number;

    constructor(template:templates.DomInstructionTemplates) {
        this.createInstructions = [];
        this.uniqueElements = [];
        this.elementsStack = [];
        this.elementsLength = 0;
        this.domTemplates = template;
    }

    generateAccessName():string {
        return "n" + this.elementsLength.toString();
    }

    beginElement(type:string, attribs:{[key:string]:string}):void {
        var createElement:templates.CreateElement;
        var accessName:string = attribs['id'];
        var instr:string;

        if(accessName) {
            createElement = new templates.CreateElement(accessName, type);
            instr = this.domTemplates.createElementMember.out(createElement);
        }
        else {
            accessName = this.generateAccessName();
            createElement = new templates.CreateElement(accessName, type);
            instr = this.domTemplates.createElementLocal.out(createElement);
        }

        this.createInstructions.push(instr);
        this.setAttributes(accessName, attribs);

        this.elementsStack.push(accessName);
        this.elementsLength++;
    }

    setAttributes(accessName:string, attribs:{[key:string]:string}):void {
        for(var key in attribs) {
            var value:string = attribs[key];

            var instr:string;
            if(key == 'id' && this.domTemplates.setAttributeId) {
                var setAttribId:templates.SetAttributeId = new templates.SetAttributeId(accessName, value);
                instr = this.domTemplates.setAttributeId.out(setAttribId);
            }
            else {
                var setAttribOther:templates.SetAttributeOther = new templates.SetAttributeOther(accessName, key, value);
                instr = this.domTemplates.setAttributeOther.out(setAttribOther);
            }

            if(instr)
                this.createInstructions.push(instr);
        }
    }

    endElement():void {
        this.elementsStack.pop();
    }

    addText(text:string):void {
        var instr:string = this.domTemplates.createText.out(new templates.CreateText(this.generateAccessName(), text));
        this.createInstructions.push(instr);
    }
}

export class DomInstructionsFactory {

    domInstructionTemplates:templates.DomInstructionTemplates;

    constructor(domInstructionTemplates:templates.DomInstructionTemplates) {
        this.domInstructionTemplates = domInstructionTemplates;
    }

    createDomInstructions():DomInstructions {
        return new DomInstructions(this.domInstructionTemplates);
    }
}

export class DomClassBuilder implements htmlparser.Handler {

    domClassTemplate:templates.DomClassTemplate;
    domInstructionsFactory:DomInstructionsFactory;
    currentDomInstructions:DomInstructions;
    htmlParser:htmlparser.Parser;

    constructor(classTemplate:templates.DomClassTemplate, domInstructionTemplates:templates.DomInstructionTemplates) {
        this.domClassTemplate = classTemplate;
        this.domInstructionsFactory = new DomInstructionsFactory(domInstructionTemplates);
    }

    onopentag(name:string, attribs:{[type:string]: string}):void {
        this.currentDomInstructions.beginElement(name, attribs);
    }

    ontext(text:string):void {
        var matches:string[] = text.match(/[^\s\n]/gmi);

        if(matches && matches.length > 0)
            this.currentDomInstructions.addText(text);
    }

    onclosetag(name:string):void {
        this.currentDomInstructions.endElement();
    }

    build(className:string, htmlContent:string, callback:(err:Error, output:string) => void):void {
        this.currentDomInstructions = this.domInstructionsFactory.createDomInstructions();

        this.htmlParser.parseComplete(htmlContent);

        var domClass:templates.DomClass = new templates.DomClass();
        domClass.className = className;
        domClass.creation = this.currentDomInstructions.createInstructions.join("\n");
        domClass.elements = this.currentDomInstructions.uniqueElements.join("\n");

        callback(null, this.domClassTemplate.newDomClass.out(domClass));
    }
}

export function init(templateResource:string):DomClassBuilder {
    var resource:templates.Resource = new templates.Resource(templateResource);
    var domClassTempl:templates.DomClassTemplate = new templates.DomClassTemplate(resource);
    var domInstrTempl:templates.DomInstructionTemplates = new templates.DomInstructionTemplates(resource);
    return new DomClassBuilder(domClassTempl, domInstrTempl);
}