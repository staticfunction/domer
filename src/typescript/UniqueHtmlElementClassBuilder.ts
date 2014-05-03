/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/2/2014.
 */

import fs = require('fs');
import UniqueHtmlElement = require('./UniqueHtmlElement');
import HtmlTagInfo = require('./HtmlTagInfo');

class UniqueHtmlElementClassBuilder {

    classTemplate:string;

    constructor() {
        this.classTemplate = fs.readFileSync(__dirname + "/resources/TypescriptClass.template", "UTF-8");
    }

    create(className:string, uElements:UniqueHtmlElement[]): string {

        var newClass:string = this.classTemplate.slice();

        newClass = newClass.replace(/@className@/gm, className);

        var properties:string[] = [];

        for(var i:number = 0; i < uElements.length; i++) {
            var prop:string = uElements[i].elementId + ": " + uElements[i].elementInterface + ";";
            properties.push(prop);
        }

        newClass = newClass.replace(/@elements@/, properties.join("\r\n "));

        return newClass;
    }
}

export = UniqueHtmlElementClassBuilder;