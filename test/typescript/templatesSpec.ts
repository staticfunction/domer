/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import templates = require('../../src/typescript/templates');
import fs = require('fs');
import assert = require('assert');

var template_resolve_id:string = fs.readFileSync( __dirname + "/resources/code_template_resolved_id.json", "UTF-8");
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
    "    elements#\n",
    "    constructor() {",
    "        resolvedId = document._resolvedId_ = document._resolvedId_++ || 0;",
    "        creation#",
    "    }\n",
    "    appendTo(parent:HTMLElement): void {",
    "        display#",
    "    }",
    "}\n",
    "export = className#;"
].join('\n');

var uniqueElement:string = "elementId#: elementType#;";
var createElementLocal:string = "var instanceName# = document.createElement('type#');";
var createElementMember:string = "this.instanceName# = document.createElement('type#');";
var createText:string = "var instanceName# = document.createTextNode('text#');";
var setAttributeOther:string = "accessName#.setAttribute('key#', 'value#');";
var setAttributeId:string = "accessName#.setAttribute('id', 'id#_' + resolvedId);";
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

describe("DomInstruction Templates", () => {

    var domTemplates:templates.DomInstructionTemplates = new templates.DomInstructionTemplates(new templates.Resource(template_resolve_id));

    it("produces new content out based on the template", () => {
        var appendChild:templates.AppendChild = new templates.AppendChild("this.root", "this.mainView");
        var appendChildOutput:string = "this.root.appendChild(this.mainView);";
        assert.equal(domTemplates.appendChild.out(appendChild), appendChildOutput);

        var createElemLocal:templates.CreateElement = new templates.CreateElement("n0", "div");
        var createElemLocalOutput:string = "var n0 = document.createElement('div');";
        assert.equal(domTemplates.createElementLocal.out(createElemLocal), createElemLocalOutput);

        var createElemMember:templates.CreateElement = new templates.CreateElement("container", "div");
        var createElemMemberOutput:string = "this.container = document.createElement('div');";
        assert.equal(domTemplates.createElementMember.out(createElemMember), createElemMemberOutput);

        var createText:templates.CreateText = new templates.CreateText("n2", "some text.");
        var createTextOutput:string = "var n2 = document.createTextNode('some text.');";
        assert.equal(domTemplates.createText.out(createText), createTextOutput);

        var setAttributeId:templates.SetAttributeId = new templates.SetAttributeId("this.mainView", "mainView");
        var setAttributeIdOutput:string = "this.mainView.setAttribute('id', 'mainView_' + resolvedId);";
        assert.equal(domTemplates.setAttributeId.out(setAttributeId), setAttributeIdOutput);

        var setAttributeOther:templates.SetAttributeOther = new templates.SetAttributeOther("this.mainView", "class", "container");
        var setAttributeOtherOutput:string = "this.mainView.setAttribute('class', 'container');";
        assert.equal(domTemplates.setAttributeOther.out(setAttributeOther), setAttributeOtherOutput);
    })


});