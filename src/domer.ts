/// <reference path="../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 4/29/2014.
 */

import fs = require("fs");
import dompiler = require("./dompiler");
import path = require("path");
import glob = require("glob");

export enum Options {
    STRIP_IDS,
    RETAIN_IDS,
    RESOLVE_IDS
}

class Resource {
    static STRIP_IDS_TEMPLATE:string = path.join(__dirname, "resources", "code_template_strip_id.json");
    static RETAIN_IDS__TEMPLATE:string = path.join(__dirname, "resources", "code_template_retain_id.json");
    static RESOLVED_IDS_TEMPLATE:string = path.join(__dirname, "resources", "code_template_resolved_id.json");
    static HTML_REFERENCE:string = path.join(__dirname, "resources", "htmlref.json");
}

class DomerUtil {
    static getClassName(fileName:string):string {
        var matches:string[] = fileName.match(/\w+/);
        if(!matches || matches.length < 1)
            throw new Error("Can't create class name from file.");

        return matches[0];
    }
}

export class DomerResource {
    source:string;
    target:string;
    encoding:string;

    constructor(source:string, target:string, encoding:string = "utf8") {
        this.source = source;
        this.target = target;
        this.encoding = encoding;
    }
}

export class Domer {

    domerResource:DomerResource;
    options:Options;

    domClassBuilderFactory:dompiler.DomClassBuilderFactory;

    constructor(domerResource:DomerResource, options:Options = Options.STRIP_IDS) {
        this.domerResource = domerResource;

        var templateResourcePath:string;

        switch(options) {
            case Options.RETAIN_IDS:
                templateResourcePath = Resource.RETAIN_IDS__TEMPLATE;
                break;

            case Options.RESOLVE_IDS:
                templateResourcePath = Resource.RESOLVED_IDS_TEMPLATE;
                break;

            default:
                templateResourcePath = Resource.STRIP_IDS_TEMPLATE;
                break;
        }

        var templateResource:string = fs.readFileSync(templateResourcePath, "utf8");
        var htmlReference:string  = fs.readFileSync(Resource.HTML_REFERENCE, "utf8");

        this.domClassBuilderFactory = dompiler.init(templateResource, htmlReference);
    }

    build(watch:boolean = false): void {

        glob(this.domerResource.source, null, (err:Error, files:string[]) => {

            if(files) {
                for(var i = 0; i < files.length; i++) {
                    var filePath:string =  files[i];
                    var className:string = DomerUtil.getClassName(path.basename(filePath));
                    console.log("Building: ", className);

                    var fileContents:string = fs.readFileSync(filePath, this.domerResource.encoding);
                    var classBuilder:dompiler.DomClassBuilder = this.domClassBuilderFactory.newBuilder(className, fileContents);

                    try {
                        var domClass:dompiler.DomClass = classBuilder.build();
                        fs.writeFileSync(path.join(path.dirname(filePath), domClass.fileName), domClass.contents);
                    }
                    catch(e) {
                        console.error(e);
                    }
                }
            }
        });
    }
}