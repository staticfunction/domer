/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/1/2014.
 */
import assert = require('assert');
import fs = require('fs');
import UniqueHtmlElementExtractor = require('../../src/typescript/UniqueHtmlElementExtractor');
import UniqueHtmlElement = require('../../src/typescript/UniqueHtmlElement');

var htmlInput:string =  fs.readFileSync("test/typescript/input/Email.html", "UTF-8");

describe("UniqueHtmlElement extraction", () => {

    var extractor:UniqueHtmlElementExtractor;

    before(() => {
        extractor = new UniqueHtmlElementExtractor();
    });

    it("get a tag from a node fragment", () => {
       var tagName:string = extractor.getTagFromFragment("<div class");
       assert.equal(tagName, "div");
    });

    it("get the id value from a node fragment", () => {
        var id:string = extractor.getIdFromFragment("<div class='container' id='main'")
    })

    it("can produce an array of UniqueHtmlElement", () => {
       var uElements:UniqueHtmlElement[] = extractor.extract(htmlInput);
       assert.equal(uElements.length, 3);

       var subjectElement:UniqueHtmlElement = uElements[0];
       assert.equal(subjectElement.elementId, "subject", "the id should be 'subject");
       assert.equal(subjectElement.elementInterface, "HTMLLabelElement", "the interface should be HTMLLabelElement");

        var messageElement:UniqueHtmlElement = uElements[1];
        assert.equal(messageElement.elementId, "message", "the id should be 'message'");
        assert.equal(messageElement.elementInterface, "HTMLParagraphElement", "the interface should be HTMLParagraphElement");

        var dataHolderElement:UniqueHtmlElement = uElements[2];
        assert.equal(dataHolderElement.elementId, "dataHolder", "the id should be 'dataHolder'");
        assert.equal(dataHolderElement.elementInterface, "any", "the interface should be 'any' as we don't have a Typescript " +
            "equivalent interface for 'data' tag yet");
    })

});
