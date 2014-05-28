/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import dompiler = require('../../src/typescript/dompiler');
import assert = require('assert');
import fs = require('fs');

var strip_ids_output:string = fs.readFileSync(__dirname + "/output/Chat.ts", "UTF-8");
var strip_ids_input:string = fs.readFileSync(__dirname + "/input/Chat.html", "UTF-8");
var strip_id_template:string = fs.readFileSync("src/typescript/resources/code_template_strip_id.json", "UTF-8");
var htmlRefResource:string = fs.readFileSync("src/typescript/resources/htmlref.json", "UTF-8");

describe("DomClassBuilder building", () => {
    it("parses html and builds a class based on it's contents", (done:MochaDone) => {
        var classBuilder:dompiler.DomClassBuilder = dompiler.init(strip_id_template, htmlRefResource);
        classBuilder.build("Chat", strip_ids_input, (error:Error, output:string) => {
            assert.equal(output, strip_ids_output);
            done();
        });
    })
})


