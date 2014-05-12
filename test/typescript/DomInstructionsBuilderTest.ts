/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/5/2014.
 */
import DomInstructionsBuilder = require("../../src/typescript/HtmlDocumentBuilder");
import DomerIdOptions = require('../../src/DomerIdOptions');
/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/1/2014.
 */
import assert = require('assert');
import fs = require('fs');

var htmlInput:string =  fs.readFileSync("test/typescript/input/Chat.html", "UTF-8");

var domResolveIdOutput:string =
    "var n1:HTMLDivElement = document.createElement('div');" +
    "var n2:HTMLLabelElement = document.createElement('label');" +
    "n2.setAttribute('id', 'subject_' + id);" +
    "var n3:HTMLLabelElement = document.createElement('label');" +
    "n3.setAttribute('id', 'message_' + id);" +
    "var n4:any = document.createElement('data');" +
    "n4.setAttribute('id', 'dataHolder_' + id);" +
    "var n5:HTMLParagraphElement = document.createElement('p');" +
    "var n6:Text = document.createTextNode('This is some text with a ');" +
    "var n7:HTMLElement = document.createElement('b');" +
    "var n8:Text = document.createTextNode('bold word.');" +
    "var n9:HTMLDivElement = document.createElement('div');" +
    "var n10:HTMLLabelElement = document.createElement('label');" +
    "n10.setAttribute('id', 'displayName_' + id);" +
    "n9.appendChild(n10);" +
    "n1.appendChild(n9);" +
    "n7.appendChild(n8);" +
    "n5.appendChild(n7);" +
    "n5.appendChild(n6);" +
    "n1.appendChild(n5);" +
    "n1.appendChild(n4);" +
    "n1.appendChild(n3);" +
    "n1.appendChild(n2);" +
    "n1.appendChild(n1);";

describe("Document Builder", () => {

    var domBuilder: DomInstructionsBuilder;

    before(() => {
        domBuilder = new DomInstructionsBuilder(DomerIdOptions.RESOLVE_IDS);
    });

    it("parses the html text", () => {
       domBuilder.build(htmlInput);
    });

});
