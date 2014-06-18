/// <reference path="../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import templates = require('../src/templates');
import fs = require('graceful-fs');
import assert = require('assert');

var template_resolve_id:string = fs.readFileSync("src/resources/code_template_resolved_id.json", "utf8");
var template_no_dom_class:string = fs.readFileSync(__dirname + "/resources/no_dom_class.json", "utf8");
var template_no_unique_elem:string = fs.readFileSync(__dirname + "/resources/no_unique_element.json", "utf8");
var template_no_create_elem_local:string = fs.readFileSync(__dirname + "/resources/no_create_elem_local.json", "utf8");
var template_no_create_elem_member:string = fs.readFileSync(__dirname + "/resources/no_create_elem_member.json", "utf8");
var template_no_create_text:string = fs.readFileSync(__dirname + "/resources/no_create_text.json", "utf8");
var template_no_set_attrib_other:string = fs.readFileSync(__dirname + "/resources/no_set_attrib_other.json", "utf8");
var template_no_set_attrib_id:string = fs.readFileSync(__dirname + "/resources/no_set_attrib_id.json", "utf8");
var template_no_append_child:string = fs.readFileSync(__dirname + "/resources/no_append_child.json", "utf8");

var template_resolve_id_json:{[s:string]:any} = JSON.parse(template_resolve_id);

describe("Resource template extraction", () => {
   it("extracts templates", () => {
        var resource = new templates.Resource(template_resolve_id);

        assert.equal(resource.newDomClass, template_resolve_id_json["newDomClass"].join(templates.Line.getSeparator()));
        assert.equal(resource.uniqueElement, template_resolve_id_json["uniqueElement"]);
        assert.equal(resource.createElementLocal, template_resolve_id_json["createElementLocal"]);
        assert.equal(resource.createElementMember, template_resolve_id_json["createElementMember"]);
        assert.equal(resource.createText, template_resolve_id_json["createText"]);
        assert.equal(resource.setAttributeOther, template_resolve_id_json["setAttributeOther"]);
        assert.equal(resource.setAttributeId, template_resolve_id_json["setAttributeId"]);
        assert.equal(resource.appendChild, template_resolve_id_json["appendChild"]);
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