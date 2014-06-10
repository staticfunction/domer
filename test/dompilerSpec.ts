/// <reference path="../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import dompiler = require('../src/dompiler');
import templates = require('../src/templates');
import assert = require('assert');
import fs = require('fs');

var strip_ids_output:string[] = [
    "class Chat {",
    "",
    "    rootNodes: HTMLElement[];",
    "    parent: HTMLElement;",
    "    subject: HTMLLabelElement;",
    "    message: HTMLParagraphElement;",
    "    dataHolder: any;",
    "    displayName: HTMLLabelElement;",
    "",
    "    constructor() {",
    "        this.rootNodes = [];",
    "        var n0 = document.createElement('div');",
    "        this.subject = document.createElement('label');",
    "        this.subject.setAttribute('class', 'header, important');",
    "        this.message = document.createElement('p');",
    "        this.dataHolder = document.createElement('data');",
    "        var n4 = document.createElement('p');",
    "        var n5 = document.createTextNode('This is some text with a ');",
    "        var n6 = document.createElement('b');",
    "        var n7 = document.createTextNode('bold word.');",
    "        var n8 = document.createElement('div');",
    "        this.displayName = document.createElement('label');",
    "        this.rootNodes.push(n0);",
    "        n0.appendChild(this.subject);",
    "        n0.appendChild(this.message);",
    "        n0.appendChild(this.dataHolder);",
    "        n0.appendChild(n4);",
    "        n4.appendChild(n5);",
    "        n4.appendChild(n6);",
    "        n6.appendChild(n7);",
    "        n0.appendChild(n8);",
    "        n8.appendChild(this.displayName);",
    "    }",
    "",
    "    appendTo(parent:HTMLElement): void {",
    "        this.remove();",
    "        this.parent = parent;",
    "        this.rootNodes.forEach((node:HTMLElement) => {",
    "            this.parent.appendChild(node);",
    "        });",
    "    }",
    "    remove(): void {",
    "        if(!this.parent)",
    "            return;",
    "        this.rootNodes.forEach((node:HTMLElement) => {",
    "            this.parent.removeChild(node);",
    "        });",
    "        this.parent = null;",
    "    }",
    "}",
    "",
    "export = Chat;"
];

var strip_ids_input:string[] = [
    "<div>",
    "    <label id=\"subject\" class=\"header, important\"></label>",
    "    <p id=\"message\"></p>",
    "    <data id=\"dataHolder\"></data>",
    "    <p>This is some text with a <b>bold word.</b></p>",
    "    <div>",
    "       <label id=\"displayName\"></label>",
    "    </div>",
    "</div>"
];
var strip_id_template:string = fs.readFileSync("src/resources/code_template_strip_id.json", "utf8");
var htmlRefResource:string = fs.readFileSync("src/resources/htmlref.json", "utf8");

describe("DomClassBuilder building", () => {

    var domClassBuilderFactory:dompiler.DomClassBuilderFactory = dompiler.init(strip_id_template, htmlRefResource);;

    it("parses html and builds a class based on it's contents", () => {
        var classBuilder:dompiler.DomClassBuilder = domClassBuilderFactory.newBuilder("Chat", strip_ids_input.join(templates.Line.getSeparator()));
        assert.equal(classBuilder.build().contents, strip_ids_output.join(templates.Line.getSeparator()));
    });
})


