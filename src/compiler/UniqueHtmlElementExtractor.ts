/**
 * Created by jcabresos on 4/30/2014.
 */
import UniqueHtmlElement = require('./UniqueHtmlElement');
import HtmlTagInfo = require('./HtmlTagInfo');

class UniqueHtmlElementExtractor {

    static NODES_WITH_ID:RegExp = /\<[a-z1-6]+\s+[\w\d\"\=\s\,\-\']*(id\=)+(\"|\'){1}[a-z0-9]+/igm;

    static HTML_TAG:RegExp = /\<[a-z1-6]+/igm;

    static OPENING_TAG:RegExp = /</;

    static ID_ATTRIBUTE:RegExp = /(id\=)+(\"|\'){1}[\"a-z0-9]+/igm;

    static ID_DECLARATION:RegExp = /((id\=\")|\"|\')+/ig;

    htmlText:string;

    htmlRef:{[tagName:string]: HtmlTagInfo};

    output:UniqueHtmlElement[];

    constructor(htmlText:string, htmlRef:{[tagName:string]: HtmlTagInfo}) {
        this.htmlText = htmlText;
        this.htmlRef = htmlRef;
        this.output = [];
    }

    getTagFromFragment(fragment:string):string {
        var tagFragment:string = fragment.match(UniqueHtmlElementExtractor.HTML_TAG)[0];
        return tagFragment.replace(UniqueHtmlElementExtractor.OPENING_TAG, "");
    }

    getIdFromFragment(fragment:string):string {
        var idFragment:string = fragment.match(UniqueHtmlElementExtractor.ID_ATTRIBUTE)[0];
        return idFragment.replace(UniqueHtmlElementExtractor.ID_DECLARATION, "");
    }

    extract():UniqueHtmlElement[] {
        this.output = [];

        var matches:string[] = this.htmlText.match(UniqueHtmlElementExtractor.NODES_WITH_ID);

        for(var i:number = 0; i < matches.length; i++) {

            var tagName:string = this.getTagFromFragment(matches[i]);
            var idValue:string = this.getIdFromFragment(matches[i]);

            var tagInfo:HtmlTagInfo = this.htmlRef[tagName];

            var tagInterfaceName:string = tagInfo && tagInfo.interface ? tagInfo.interface : "any";

            var uElement:UniqueHtmlElement = new UniqueHtmlElement(idValue, tagInterfaceName);

            this.output.push(uElement);
        }

        return this.output;
    }
}

export = UniqueHtmlElementExtractor;