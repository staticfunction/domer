/**
 * Created by jcabresos on 5/2/2014.
 */
/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/1/2014.
 */
import assert = require('assert');
import fs = require('fs');
import UniqueHtmlElementExtractor = require('../../src/typescript/UniqueHtmlElementExtractor');
import UniqueHtmlElementClassBuilder = require('../../src/typescript/UniqueHtmlElementClassBuilder');
import UniqueHtmlElement = require('../../src/typescript/UniqueHtmlElement');

describe("UniqueHtmlClassBuilder creates a Class.domerx", () => {

    var classBuilder:UniqueHtmlElementClassBuilder;
    var extractor:UniqueHtmlElementExtractor;
    var htmlInput:string;
    var htmlOutput:string;
    var toStrip:RegExp = /[\r\n\s]/gm;

    before(() => {
        htmlInput =  fs.readFileSync(__dirname + "/input/Email.html", "UTF-8");
        htmlOutput = fs.readFileSync(__dirname + "/output/Email.ts", "UTF-8");
        htmlOutput = htmlOutput.replace(toStrip, "");
        classBuilder = new UniqueHtmlElementClassBuilder();
        extractor = new UniqueHtmlElementExtractor();
    });

    it("can produce a class based on the class name and elements", () => {
        var uElements:UniqueHtmlElement[] = extractor.extract(htmlInput);
        var emailClassOutput:string = classBuilder.create("Email", uElements);
        emailClassOutput = emailClassOutput.replace(toStrip, "");
        assert.equal(emailClassOutput, htmlOutput);
    });

});


