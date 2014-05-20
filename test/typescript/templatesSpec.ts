/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import templates = require('../../src/typescript/templates');
import fs = require('fs');
import assert = require('assert');

var template_resolve_id:string = fs.readFileSync("./resources/code_template_resolve_id.xml", "UTF-8");
var template_no_dom_class:string = fs.readFileSync("./resources/code_template_no_dom_class.xml", "UTF-8");

var domClass:string =
    "class className# {\n\n    elements#\n\n    constructor() {\n" +
    "        resolvedId = document._resolvedId_ = document._resolvedId_++ || 0;\n" +
    "        creation#\n    }\n\n    appendTo(parent:HTMLElement): void {\n" +
    "        display#\n    }\n\nexport = className#;";

var uniqueElement:string = "elementId#: elementType#;";
var createElementLocal:string = "var instanceName# = document.createElement('type#');";
var createElementMember:string = "this.instanceName# = document.createElement('type#');";
var createText:string = "var instanceName# = document.createTextNode('text#');";
var setAttributeOther:string = "accessName#.setAttribute('key#', 'value#');";
var setAttributeId:string = "accessName#.setAttribute('id', 'id_' + resolvedId);";
var appendChild:string = "parent#.appendChild(child#);";

describe("Resource template extraction", () => {
   it("extracts templates", (done:MochaDone) => {
        var resource = new templates.Resource(template_resolve_id);
        assert.equal(resource.newDomClass, domClass);
        assert.equal(resource.uniqueElement, uniqueElement);
        assert.equal(resource.createElementLocal, createElementLocal);
        assert.equal(resource.createElementMember, createElementMember);
        assert.equal(resource.createText, createText);
        assert.equal(resource.setAttributeOther, setAttributeOther);
        assert.equal(resource.setAttributeId, setAttributeId);
        assert.equal(resource.appendChild, appendChild);
   });
});