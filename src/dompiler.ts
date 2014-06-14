/// <reference path="../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 5/19/2014.
 */
import templates = require('./templates');
import htmlparser = require('htmlparser2');
import jsesc = require('js-string-escape');

//TODO: warn about using obsolete tags, suggest an alternative if any.
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
    stackInstructions:string[];
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

    camelCaseAccessName(value:string):string {
        if(!value)
            return null;

        var words:string[] = value.match(/[a-z0-9]+/gmi);
        var output:string[] = [];
        var firstTaken:boolean;

        words.forEach((word:string) => {
            if(!firstTaken) {
                output.push(word);
                firstTaken = true;
                return;
            }

            output.push(word.charAt(0).toUpperCase());
            output.push(word.substr(1));
        })

        return output.join("");
    }

    beginElement(type:string, attribs:{[key:string]:string}):void {
        var createElement:templates.CreateElement;
        var instanceName:string = this.camelCaseAccessName(attribs['id']);
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
        var stackInstruction:string;

        if(this.elementsStack.length == 0) {
            var appendToRoot:templates.AppendToRoot = new templates.AppendToRoot(accessName);
            stackInstruction = this.domTemplates.appendToRoot.out(appendToRoot);
        }
        else {
            var currentParent:string = this.elementsStack[this.elementsStack.length - 1];
            var appendChild:templates.AppendChild = new templates.AppendChild(currentParent, accessName);
            stackInstruction = this.domTemplates.appendChild.out(appendChild);
        }

        this.stackInstructions.push(stackInstruction);

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

    createDomInstructions(htmlText:string):DomInstructions {
        var domInstructions:DomInstructions = new DomInstructions(this.domInstructionTemplates, this.htmlRef);

        var htmlParser:htmlparser.Parser = new htmlparser.Parser({
            onopentag: (name:string, attribs:{[type:string]: string}) => {
                domInstructions.beginElement(name, attribs);
            },
            ontext: (text:string) => {
                var matches:string[] = text.match(/[^\s\r\n]/gmi);

                if(matches && matches.length > 0) {
                    domInstructions.addText(jsesc(text));
                }
            },
            onclosetag: (name:string) => {
                domInstructions.endElement();
            },
            onerror: (error:Error) => {
                throw error;
            }
        });

        htmlParser.parseComplete(htmlText);

        return domInstructions;
    }
}

export class DomClass {
    fileName:string;
    contents:string;

    constructor(fileName:string, contents:string) {
        this.fileName = fileName;
        this.contents = contents;
    }
}

export class DomClassBuilder {

    className:string;
    domInstructions:DomInstructions;
    domClassTemplate:templates.DomClassTemplate;

    constructor(className:string, domInstructions:DomInstructions, classTemplate:templates.DomClassTemplate) {
        this.className = className;
        this.domInstructions = domInstructions;
        this.domClassTemplate = classTemplate;
    }

    build():DomClass {
        var domClass:templates.DomClass = new templates.DomClass();
        domClass.className = this.className;
        domClass.creation = this.domInstructions.createInstructions.join(templates.Line.getSeparator());
        domClass.stacking = this.domInstructions.stackInstructions.join(templates.Line.getSeparator());
        domClass.elements = this.domInstructions.uniqueElements.join(templates.Line.getSeparator());

        var contents:string = this.domClassTemplate.newDomClass.out(domClass);
        var fileName:string = this.domClassTemplate.fileName.out(new templates.FileName(this.className));

        return new DomClass(fileName, contents);
    }
}

export class DomClassBuilderFactory {

    domClassTemplate:templates.DomClassTemplate;
    domInstructionFactory:DomInstructionsFactory;

    constructor(classTemplate:templates.DomClassTemplate, domInstructionTemplates:templates.DomInstructionTemplates, htmlRef:HtmlReference) {
        this.domClassTemplate = classTemplate;
        this.domInstructionFactory = new DomInstructionsFactory(domInstructionTemplates, htmlRef);
    }

    newBuilder(className:string, htmlText:string):DomClassBuilder {
        var domInstructions:DomInstructions = this.domInstructionFactory.createDomInstructions(htmlText);
        var domClassBuilder:DomClassBuilder = new DomClassBuilder(className, domInstructions, this.domClassTemplate);
        return domClassBuilder;
    }

}

export function init(templateResource:string, htmlRefResource:string):DomClassBuilderFactory {
    var resource:templates.Resource = new templates.Resource(templateResource);
    var domClassTempl:templates.DomClassTemplate = new templates.DomClassTemplate(resource);
    var domInstrTempl:templates.DomInstructionTemplates = new templates.DomInstructionTemplates(resource);
    var htmlRef:HtmlReference = new HtmlReference(htmlRefResource);
    return new DomClassBuilderFactory(domClassTempl, domInstrTempl, htmlRef);
}