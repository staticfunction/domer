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

export class HtmlReference {

    static UNKNOWN_ELEMENT:string = "_unknown_element_";

    htmlRef:{[type:string]:HtmlTagInfo};

    constructor(htmlRefResource:string) {
        this.htmlRef = JSON.parse(htmlRefResource);
    }

    getHtmlTagInfo(tagName:string):HtmlTagInfo {
        return this.htmlRef[tagName];
    }

    getHtmlTagInterface(tagName:string):string {
        var tagInfo:HtmlTagInfo = this.getHtmlTagInfo(tagName);

        if(!tagInfo || !tagInfo.interface)
            tagInfo = this.getHtmlTagInfo(HtmlReference.UNKNOWN_ELEMENT);

        return tagInfo.interface;
    }
}

export class DomInstructions {

    static ROOT_ELEMENT:string = "root";
    static ELEMENT_PREFIX:string = "n";

    createInstructions:string[];
    stackInstructions:string[];s
    uniqueElements:string[];

    private domTemplates:templates.DomInstructionTemplates;
    private htmlRef:HtmlReference;
    private elementsStack:string[];
    private elementsLength:number;
    private rootAccessName:string;

    constructor(template:templates.DomInstructionTemplates, htmlRef:HtmlReference) {
        this.domTemplates = template;
        this.htmlRef = htmlRef;
        this.createInstructions = [];
        this.stackInstructions = [];
        this.uniqueElements = [];
        this.elementsStack = [];
        this.elementsLength = 0;
        this.rootAccessName = this.domTemplates.accessNameMember.out(new templates.AccessName(DomInstructions.ROOT_ELEMENT));
    }

    generateAccessName():string {
        return  DomInstructions.ELEMENT_PREFIX + this.elementsLength.toString();
    }

    beginElement(type:string, attribs:{[key:string]:string}):void {
        var createElement:templates.CreateElement;
        var instanceName:string = attribs['id'];
        var accessName:string;
        var instr:string;

        if(instanceName) {
            createElement = new templates.CreateElement(instanceName, type);
            instr = this.domTemplates.createElementMember.out(createElement);
            accessName =this.domTemplates.accessNameMember.out(new templates.AccessName(instanceName));

            var uElem:templates.UniqueElement = new templates.UniqueElement(instanceName, this.htmlRef.getHtmlTagInterface(type));
            this.uniqueElements.push(this.domTemplates.uniqueElement.out(uElem));
        }
        else {
            instanceName = this.generateAccessName();
            createElement = new templates.CreateElement(instanceName, type);
            instr = this.domTemplates.createElementLocal.out(createElement);
            accessName =this.domTemplates.accessNameLocal.out(new templates.AccessName(instanceName));
        }

        this.createInstructions.push(instr);
        this.setAttributes(accessName, attribs);
        this.stack(accessName);
        this.elementsLength++;
    }

    stack(accessName:string, canHaveChildren:boolean = true):void {
        var currentParent:string;

        if(this.elementsStack.length == 0) {
            currentParent = this.rootAccessName;
        }
        else {
            currentParent = this.elementsStack[this.elementsStack.length - 1];
        }

        var appendChild:templates.AppendChild = new templates.AppendChild(currentParent, accessName);
        this.stackInstructions.push(this.domTemplates.appendChild.out(appendChild));

        if(canHaveChildren)
            this.elementsStack.push(accessName);
    }

    setAttributes(accessName:string, attribs:{[key:string]:string}):void {
        for(var key in attribs) {
            var value:string = attribs[key];

            var instr:string;
            if(key == 'id') {
                if(this.domTemplates.setAttributeId) {
                    var setAttribId:templates.SetAttributeId = new templates.SetAttributeId(accessName, value);
                    instr = this.domTemplates.setAttributeId.out(setAttribId);
                }
                else
                    continue;
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
        var accessName:string = this.generateAccessName();
        var instr:string = this.domTemplates.createText.out(new templates.CreateText(accessName, text));
        this.createInstructions.push(instr);
        this.stack(accessName, false);
        this.elementsLength++;
    }
}

export class DomInstructionsFactory {

    domInstructionTemplates:templates.DomInstructionTemplates;
    htmlRef:HtmlReference;

    constructor(domInstructionTemplates:templates.DomInstructionTemplates, htmlRef:HtmlReference) {
        this.domInstructionTemplates = domInstructionTemplates;
        this.htmlRef = htmlRef;
    }

    createDomInstructions():DomInstructions {
        return new DomInstructions(this.domInstructionTemplates, this.htmlRef);
    }
}

export class DomClassBuilder implements htmlparser.Handler {

    domClassTemplate:templates.DomClassTemplate;
    domInstructionsFactory:DomInstructionsFactory;
    currentDomInstructions:DomInstructions;
    htmlParser:htmlparser.Parser;

    constructor(classTemplate:templates.DomClassTemplate, domInstructionTemplates:templates.DomInstructionTemplates, htmlRef:HtmlReference) {
        this.domClassTemplate = classTemplate;
        this.domInstructionsFactory = new DomInstructionsFactory(domInstructionTemplates, htmlRef);
        this.htmlParser = new htmlparser.Parser(this);
    }

    onopentag(name:string, attribs:{[type:string]: string}):void {
        this.currentDomInstructions.beginElement(name, attribs);
    }

    ontext(text:string):void {
        var matches:string[] = text.match(/[^\s\r\n]/gmi);

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
        domClass.creation = this.currentDomInstructions.createInstructions.join(templates.Line.getSeparator());
        domClass.stacking = this.currentDomInstructions.stackInstructions.join(templates.Line.getSeparator());
        domClass.elements = this.currentDomInstructions.uniqueElements.join(templates.Line.getSeparator());

        callback(null, this.domClassTemplate.newDomClass.out(domClass));
    }
}

export function init(templateResource:string, htmlRefResource:string):DomClassBuilder {
    var resource:templates.Resource = new templates.Resource(templateResource);
    var domClassTempl:templates.DomClassTemplate = new templates.DomClassTemplate(resource);
    var domInstrTempl:templates.DomInstructionTemplates = new templates.DomInstructionTemplates(resource);
    var htmlRef:HtmlReference = new HtmlReference(htmlRefResource);
    return new DomClassBuilder(domClassTempl, domInstrTempl, htmlRef);
}