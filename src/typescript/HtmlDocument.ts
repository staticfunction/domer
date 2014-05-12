/**
 * Created by jcabresos on 5/8/2014.
 */
import UniqueHtmlElement = require('./UniqueHtmlElement');

class HtmlDocument {

    createInstructions:string[];
    displayInstructions:string[];
    uniqueElements:UniqueHtmlElement[];

    constructor() {
        this.createInstructions = [];
        this.displayInstructions = [];
        this.uniqueElements = [];
    }
}

 export = HtmlDocument;
