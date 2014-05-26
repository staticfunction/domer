/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import templates = require('../../src/typescript/templates');
import fs = require('fs');
import assert = require('assert');

var template_resolve_id:string = fs.readFileSync("src/typescript/resources/code_template_resolved_id.json", "UTF-8");
var template_no_dom_class:string = fs.readFileSync(__dirname + "/resources/no_dom_class.json", "UTF-8");
var template_no_unique_elem:string = fs.readFileSync(__dirname + "/resources/no_unique_element.json", "UTF-8");
var template_no_create_elem_local:string = fs.readFileSync(__dirname + "/resources/no_create_elem_local.json", "UTF-8");
var template_no_create_elem_member:string = fs.readFileSync(__dirname + "/resources/no_create_elem_member.json", "UTF-8");
var template_no_create_text:string = fs.readFileSync(__dirname + "/resources/no_create_text.json", "UTF-8");
var template_no_set_attrib_other:string = fs.readFileSync(__dirname + "/resources/no_set_attrib_other.json", "UTF-8");
var template_no_set_attrib_id:string = fs.readFileSync(__dirname + "/resources/no_set_attrib_id.json", "UTF-8");
var template_no_append_child:string = fs.readFileSync(__dirname + "/resources/no_append_child.json", "UTF-8");

var domClass:string = [
    "class className# {\n",
    "    root: DocumentFragment;",
    "    elements#\n",
    "    constructor() {",
    "        domerId = document._domerId_ = document._domerId_++ || 0;",
    "        this.root = document.createDocumentFragment();",
    "        creation#",
    "    }\n",
    "    appendTo(parent:HTMLElement): void {",
    "        parent.appendChild(this.root);",
    "    }",
    "}\n",
    "export = className#;"
].join('\n');

var uniqueElement:string = "elementId#: elementType#;";
var createElementLocal:string = "var instanceName# = document.createElement('type#');";
var createElementMember:string = "this.instanceName# = document.createElement('type#');";
var createText:string = "var instanceName# = document.createTextNode('text#');";
var setAttributeOther:string = "accessName#.setAttribute('key#', 'value#');";
var setAttributeId:string = "accessName#.setAttribute('id', 'id#_' + domerId);";
var appendChild:string = "parent#.appendChild(child#);";

describe("Resource template extraction", () => {
   it("extracts templates", () => {
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

   it("throws an error when required properties are not found", () => {
       assert.throws(() => {
           new templates.Resource(template_no_dom_class);
       }, "should throw an error as there is no domClass");
       assert.throws(() => {
           new templates.Resource(template_no_unique_elem);
       }, "should throw an error as there is no uniqueElement ");
       assert.throws(() => {
           new templates.Resource(template_no_create_elem_local);
       }, "should throw an error as there is no dom createElementLocal");
       assert.throws(() => {
           new templates.Resource(template_no_create_elem_member);
       }, "should throw an error as there is no dom createElementMember");
       assert.throws(() => {
           new templates.Resource(template_no_create_text);
       }, "should throw an error as there is no dom createText");
       assert.throws(() => {
           new templates.Resource(template_no_set_attrib_other);
       }, "should throw an error as there is no setAttributeOther");
       assert.throws(() => {
           new templates.Resource(template_no_append_child);
       }, "should throw an error as there is no appendChild");
       assert.doesNotThrow(() => {
           new templates.Resource(template_no_set_attrib_id);
       }, "should not throw an error as setAttributeId is not required");
   });
});

describe("Generic template test", () => {

    var someTemplatePattern:string[] = ["the quick brown foo#\n", "jumped over the lazy bar#."];

    var someTemplate:templates.Template<{foo:string; bar:string}> = new templates.Template<{foo:string; bar:string}>(someTemplatePattern.join(''));

    it("produces new content based on the template", () => {
        var someParam = {foo:"fox",bar:"dog"};
        assert.equal(someTemplate.out(someParam), "the quick brown fox\njumped over the lazy dog.");
    });

    it("throws an error when a required param is not found", () => {
        assert.throws(() => {someTemplate.out({foo:null,bar:"dog"})});
    });
});