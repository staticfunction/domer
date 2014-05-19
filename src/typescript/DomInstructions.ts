/**
 * Created by jcabresos on 5/18/2014.
 */
import UniqueHtmlElement = require('./UniqueHtmlElement');
import templates = require('./templates');

class DomInstructions {

    createInstructions:string[];
    displayInstructions:string[];
    uniqueElements:UniqueHtmlElement[];
    domTemplates:templates.DomInstructionTemplates;
    elementsStack:string[];
    elementsLength:number;

    constructor(template:templates.DomInstructionTemplates) {
        this.createInstructions = [];
        this.displayInstructions = [];
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
            if(key == 'id') {
                var setAttribId:templates.SetAttributeId = new templates.SetAttributeId(accessName, value);
                instr = this.domTemplates.setAttributeId.out(setAttribId);
            }
            else {
                var setAttribOther:templates.SetAttributeOther = new templates.SetAttributeOther(accessName, key, value);
                instr = this.domTemplates.setAttributeOther.out(setAttribOther);
            }

            this.createInstructions.push(instr);
        }
    }

    endElement():void {
        this.elementsStack.pop();
    }

    addText(text:string):void {

    }
}

export = DomInstructions;