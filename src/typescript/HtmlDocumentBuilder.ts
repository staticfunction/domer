/// <reference path="./resources/htmlparser2.d.ts"/>
/**
 * Created by jcabresos on 5/5/2014.
 */
import htmlparser = require('htmlparser2');
import HtmlDocument = require('./HtmlDocument');
import HtmlNodeDeclaration = require('./HtmlNodeDeclaration');
import HtmlTagInfo = require('./HtmlTagInfo');

class HtmlDocumentBuilder implements htmlparser.Handler {

    static STRIP_IDS:string = "stripIds";

    static RETAIN_IDS:string = "retainIds";

    static RESOLVE_IDS:string = "resolveIds";

    parser:htmlparser.Parser;

    nodeCount:number = 0;

    domInstructions:string[];

    nodeStack:string[];

    parentChild:{child:string; parent:string}[];

    idStrategy:string = HtmlDocumentBuilder.STRIP_IDS;

    constructor(idStrategy:string) {
        this.idStrategy = idStrategy;
        this.parser = new htmlparser.Parser(this);
        this.domInstructions = [];
        this.nodeStack = [];
        this.parentChild = [];
    }

    getCurrentParent():string {
        if(this.nodeStack.length == 0)
            return "root";
        else
            return this.nodeStack[this.nodeStack.length - 1];
    }

    getNewNodeDeclaration(id?:string):HtmlNodeDeclaration {
        var name:string;
        var declaration:string;
        var access:string;

        if(id) {
            name = id;
            declaration = "this." + name;
            access = declaration;
        }
        else {
            name = "n" + this.nodeCount;
            declaration = "var " + name;
            access = name;
        }

        this.nodeCount++;

        return new HtmlNodeDeclaration(name, declaration, access);
    }

    instantiateNode(isElement:boolean, data:string, id?:string):string {
        var node:HtmlNodeDeclaration = this.getNewNodeDeclaration(id);
        var domInstruction:string;

        if(isElement) {
            domInstruction = node.declaration + " = document.createElement('" + data + "')";
        }
        else {
            domInstruction = node.declaration + " = document.createTextNode('" + data + "')";
        }

        this.domInstructions.push(domInstruction);
        return node.access;
    }

    setAttributes(elementName:string, attribs:{[s:string]: string}):void {
        for(var key in attribs) {
            var setAttribute:string = elementName + ".setAttribute('" + key + "', '" + attribs[key] + "')";
            this.domInstructions.push(setAttribute);
        }
    }

    setupRelations():void {
        var rels:number = this.parentChild.length;
        while(rels > 0) {
            var rel:{child:string; parent:string} = this.parentChild[rels - 1];

            var domInstruction:string = rel.parent + ".appendChild(" + rel.child + ")";
            this.domInstructions.push(domInstruction);
            rels--;
        }
    }

    onopentag(name:string, attribs:{[s:string]: string}):void {
        var access:string = this.instantiateNode(true, name, attribs['id']);
        this.setAttributes(access, attribs);

        this.parentChild.push({child:access, parent: this.getCurrentParent()});

        this.nodeStack.push(access);
    }

    ontext(text:string):void {
        var matches:string[] = text.match(/[^\r\n\s]/gm);

        if(matches && matches.length > 0) {
            var access:string  = this.instantiateNode(false, text);
            this.parentChild.push({child:access, parent: this.getCurrentParent()});
        }
    }

    onclosetag(name:string):void {
        this.nodeStack.pop();
    }

    onreset():void {
        this.nodeCount = 0;
        this.domInstructions = [];
        this.nodeStack = [];
    }

    onend():void {
        this.setupRelations();
    }

    build(htmlText:string):void {
        this.parser.parseComplete(htmlText);
        console.info(this.domInstructions.join(';\n'));
    }

}

export = HtmlDocumentBuilder;