/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/15/2014.
 */
import fs = require('fs');
import libxmljs = require('libxmljs');
import templates = require('./templates');
import DomInstructions = require('./DomInstructions');

class DomInstructionsFactory {

    domInstructionTemplates:templates.DomInstructionTemplates;

    constructor(template:libxmljs.XMLDocument) {

        var getTemplateChildText = (childName:string, template:libxmljs.XMLDocument, required?:boolean) => {
            var child:libxmljs.Element = template.get(childName);

            if(!child) {
                if(required)
                    throw new Error("required code template \"" + childName + "\" not found.");

                return null;
            }

            return child.text();
        }

        var appendChild =  getTemplateChildText("appendChild", template, true);
        var createElementLocal = getTemplateChildText("createElementLocal", template, true);
        var createElementMember = getTemplateChildText("createElementMember", template, true);
        var setAttributeOther = getTemplateChildText("setAttributeOther", template, true);
        var setAttributeId = getTemplateChildText("setAttributeId", template);

        var resource:templates.DomInstructionTemplateResource = {
            "appendChild":appendChild,
            "createElementLocal":createElementLocal,
            "createElementMember":createElementMember,
            "setAttributeOther":setAttributeOther,
            "setAttributeId":setAttributeId
        };

        this.domInstructionTemplates = new templates.DomInstructionTemplates(resource);
    }

    createDomInstructions():DomInstructions {
        return new DomInstructions(this.domInstructionTemplates);
    }

}
