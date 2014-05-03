/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 4/30/2014.
 */
import fs = require('fs');
import UniqueHtmlElement = require('./UniqueHtmlElement');
import HtmlTagInfo = require('./HtmlTagInfo');

class UniqueHtmlElementExtractor {

    /**
     * TODO:
     * Move this RegExp to a class. To make this extractor more dynamic, have the RegExp externalize to a class and
     * pass an instance of that class to the instance of <code>UniqueHtmlElementExtractor</code>.
     */

    static NODES_WITH_ID:RegExp = /\<[a-z1-6]+\s+[\w\d\"\=\s\,-\-\']*(id\=)+(\"|\'){1}[a-z0-9]+/igm;

    static HTML_TAG:RegExp = /\<[a-z1-6]+/igm;

    static OPENING_TAG:RegExp = /</;

    static ID_ATTRIBUTE:RegExp = /(id\=)+(\"|\'){1}[\"a-z0-9]+/igm;

    static ID_DECLARATION:RegExp = /((id\=\")|\"|\')+/ig;

    htmlRef:{[tagName:string]: HtmlTagInfo};

    constructor() {
        this.htmlRef = JSON.parse(fs.readFileSync(__dirname + "/resources/htmlref.json", "UTF-8"));
    }

    getTagFromFragment(fragment:string):string {
        var tagFragment:string = fragment.match(UniqueHtmlElementExtractor.HTML_TAG)[0];
        return tagFragment.replace(UniqueHtmlElementExtractor.OPENING_TAG, "");
    }

    getIdFromFragment(fragment:string):string {
        var idFragment:string = fragment.match(UniqueHtmlElementExtractor.ID_ATTRIBUTE)[0];
        return idFragment.replace(UniqueHtmlElementExtractor.ID_DECLARATION, "");
    }

    extract(htmlText:string):UniqueHtmlElement[] {

        var output:UniqueHtmlElement[] = [];

        var matches:string[] = htmlText.match(UniqueHtmlElementExtractor.NODES_WITH_ID);

        for(var i:number = 0; i < matches.length; i++) {

            var tagName:string = this.getTagFromFragment(matches[i]);
            var idValue:string = this.getIdFromFragment(matches[i]);

            var tagInfo:HtmlTagInfo = this.htmlRef[tagName];

            var tagInterfaceName:string = tagInfo && tagInfo.interface ? tagInfo.interface : "any";

            var uElement:UniqueHtmlElement = new UniqueHtmlElement(idValue, tagInterfaceName);

            output.push(uElement);
        }

        return output;
    }
}

export = UniqueHtmlElementExtractor;