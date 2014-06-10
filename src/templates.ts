/// <reference path="../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 5/18/2014.
 */
export class Line {
    static SEPARATOR:string;

    static getSeparator():string {
        if(!Line.SEPARATOR) {
            Line.SEPARATOR = process.platform == "win32" ? "\r\n" : "\n";
        }

        return Line.SEPARATOR;
    }
}

export class AccessName {
    instanceName:string;
    constructor(instanceName:string) {
        this.instanceName = instanceName;
    }
}

export class UniqueElement {
    instanceName:string;
    elementType:string;

    constructor(instanceName:string, elementType:string) {
        this.instanceName = instanceName;
        this.elementType = elementType;
    }
}

export class SetAttributeId {
    accessName:string;
    id:string;

    constructor(accessName:string, id:string) {
        this.accessName = accessName;
        this.id = id;
    }
}

export class SetAttributeOther {
    accessName:string;
    key:string;
    value:string;

    constructor (accessName:string, key:string, value:string) {
        this.accessName = accessName;
        this.key = key;
        this.value = value;
    }
}

export class AppendChild {
    parent:string;
    child:string;

    constructor(parent:string, child:string) {
        this.parent = parent;
        this.child = child;
    }
}

export class AppendToRoot {
    accessName:string;

    constructor(accessName:string) {
        this.accessName = accessName;
    }
}

export class CreateElement {
    instanceName:string;
    type:string;

    constructor(instanceName:string, type:string) {
        this.instanceName = instanceName;
        this.type = type;
    }
}

export class CreateText {
    instanceName:string;
    text:string;

    constructor(instanceName:string, text:string) {
        this.instanceName = instanceName;
        this.text = text;
    }
}

export class DomClass {
    className:string;
    elements:string;
    creation:string;
    stacking:string;
}

export class FileName {
    className:string;

    constructor(className:string) {
        this.className = className;
    }
}

export class Resource {

    newDomClass:string;
    appendChild:string;
    appendToRoot:string;
    accessNameLocal:string;
    accessNameMember:string;
    createElementLocal:string;
    createElementMember:string;
    uniqueElement:string;
    createText:string;
    setAttributeOther:string;
    setAttributeId:string;
    fileName:string;

    constructor(templateResource:string) {
        var template:{[key:string]:any} = JSON.parse(templateResource);

        var getTemplateChildText = (childName:string, template:{[key:string]:any}, required?:boolean) => {
            var child:any = template[childName];

            if(!child) {
                if(required)
                    throw new Error("required code template \"" + childName + "\" not found.");

                return null;
            }

            if(Array.isArray(child)) {
                return child.join(Line.getSeparator());
            }
            else
                return child;
        }

        this.newDomClass = getTemplateChildText("newDomClass", template, true);
        this.appendChild =  getTemplateChildText("appendChild", template, true);
        this.appendToRoot =  getTemplateChildText("appendToRoot", template, true);
        this.accessNameLocal =  getTemplateChildText("accessNameLocal", template, true);
        this.accessNameMember =  getTemplateChildText("accessNameMember", template, true);
        this.createElementLocal = getTemplateChildText("createElementLocal", template, true);
        this.createElementMember = getTemplateChildText("createElementMember", template, true);
        this.uniqueElement = getTemplateChildText("uniqueElement", template, true);
        this.createText = getTemplateChildText("createText", template, true);
        this.setAttributeOther = getTemplateChildText("setAttributeOther", template, true);
        this.setAttributeId = getTemplateChildText("setAttributeId", template);
        this.fileName = getTemplateChildText("fileName", template, true);
    }
}

export class DomInstructionTemplates {
    appendChild:Template<AppendChild>;
    appendToRoot:Template<AppendToRoot>;
    accessNameLocal:Template<AccessName>;
    accessNameMember:Template<AccessName>;
    createElementLocal:Template<CreateElement>;
    createElementMember:Template<CreateElement>;
    uniqueElement:Template<UniqueElement>;
    createText:Template<CreateText>;
    setAttributeOther:Template<SetAttributeOther>;
    setAttributeId:Template<SetAttributeId>;

    constructor(resource:Resource) {
        this.appendChild = new Template<AppendChild>(resource.appendChild);
        this.appendToRoot = new Template<AppendToRoot>(resource.appendToRoot);
        this.accessNameLocal = new Template<AccessName>(resource.accessNameLocal);
        this.accessNameMember = new Template<AccessName>(resource.accessNameMember);
        this.createElementLocal = new Template<CreateElement>(resource.createElementLocal);
        this.uniqueElement = new Template<UniqueElement>(resource.uniqueElement);
        this.createText = new Template<CreateText>(resource.createText);
        this.createElementMember = new Template<CreateElement>(resource.createElementMember);
        this.setAttributeOther = new Template<SetAttributeOther>(resource.setAttributeOther);
        this.setAttributeId = resource.setAttributeId ? new Template<SetAttributeId>(resource.setAttributeId) : null;
    }
}

export class DomClassTemplate {

    newDomClass:Template<DomClass>;
    fileName:Template<FileName>;

    constructor(resource:Resource) {
        this.newDomClass = new Template<DomClass>(resource.newDomClass);
        this.fileName = new Template<FileName>(resource.fileName);
    }
}

export class Template<T> {

    static PLACE_HOLDER:RegExp = /\w+(?=#)/g;
    private source:string;
    private sourceKeys:string[];

    constructor(src:string) {
        this.source = src;
        this.sourceKeys = src.match(Template.PLACE_HOLDER);
    }

    out(params:T):string {
        var tmp:string = this.source;

        for(var i = 0; i < this.sourceKeys.length; i++) {
            var key:string = this.sourceKeys[i];

            if(params[key] == undefined || params[key] == null)
                throw new Error("Required parameter \"" + key + "\" not found.");

           var regex:RegExp = new RegExp(key + "#", "gm");
            tmp = tmp.replace(regex, params[key]);
        }

        return tmp;
    }
}
