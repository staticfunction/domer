/// <reference path="../../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 5/18/2014.
 */
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

export class CreateElement {
    instanceName:string;
    type:string;

    constructor(instanceName:string, type:string) {
        this.instanceName = instanceName;
        this.type = type;
    }
}

export class CreateText {
    accessName:string;
    text:string;

    constructor(accessName:string, text:string) {
        this.accessName = accessName;
        this.text = text;
    }
}

export class DomClass {
    className:string;
    elements:string;
    creation:string;
    display:string;
}

export class Resource {

    newDomClass:string;
    appendChild:string;
    createElementLocal:string;
    createElementMember:string;
    uniqueElement:string;
    createText:string;
    setAttributeOther:string;
    setAttributeId:string;

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
                return child.join("\n");
            }
            else
                return child;
        }

        this.newDomClass = getTemplateChildText("newDomClass", template, true);
        this.appendChild =  getTemplateChildText("appendChild", template, true);
        this.createElementLocal = getTemplateChildText("createElementLocal", template, true);
        this.createElementMember = getTemplateChildText("createElementMember", template, true);
        this.uniqueElement = getTemplateChildText("uniqueElement", template, true);
        this.createText = getTemplateChildText("createText", template, true);
        this.setAttributeOther = getTemplateChildText("setAttributeOther", template, true);
        this.setAttributeId = getTemplateChildText("setAttributeId", template);
    }
}

export class DomInstructionTemplates {
    appendChild:Template<AppendChild>;
    createElementLocal:Template<CreateElement>;
    createElementMember:Template<CreateElement>;
    createText:Template<CreateText>;
    setAttributeOther:Template<SetAttributeOther>;
    setAttributeId:Template<SetAttributeId>;

    constructor(resource:Resource) {
        this.appendChild = new Template<AppendChild>(resource.appendChild);
        this.createElementLocal = new Template<CreateElement>(resource.createElementLocal);
        this.createText = new Template<CreateText>(resource.createText);
        this.createElementMember = new Template<CreateElement>(resource.createElementMember);
        this.setAttributeOther = new Template<SetAttributeOther>(resource.setAttributeOther);
        this.setAttributeId = resource.setAttributeId ? new Template<SetAttributeId>(resource.setAttributeId) : null;

        this.setAttributeId.create();
    }
}

export class DomClassTemplate {

    newDomClass:Template<DomClass>;

    constructor(resource:Resource) {
        this.newDomClass = new Template<DomClass>(resource.newDomClass);
    }
}

export class Template<T> {

    static PLACE_HOLDER:RegExp = /\w+(?=#)/g;
    private source:string;
    private sourceKeys:string[];
    private generator:{new():T};

    constructor(src:string) {
        this.source = src;
        this.sourceKeys = src.match(Template.PLACE_HOLDER);
    }


    create():T {
        return new this.generator();
    }

    out(params:T):string {
        var tmp:string = this.source;

        for(var i = 0; i < this.sourceKeys.length; i++) {
            var key:string = this.sourceKeys[i];

            if(!params.hasOwnProperty(key))
                throw new Error("Required parameter \"" + key + "\" not found.");

            tmp = this.source.replace(key + "#", params[key]);
        }

        return tmp;
    }
}
