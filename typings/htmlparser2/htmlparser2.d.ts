/**
 * Created by jcabresos on 5/5/2014.
 */
declare module "htmlparser2" {
    export interface Handler {
        onopentag?:(name:string, attribs:{[type:string]: string}) => void;
        onopentagname?:(name:string) => void;
        onattribute?:(name:string, value:string) => void;
        ontext?:(text:string) => void;
        onclosetag?: (text:string) => void;
        onprocessinginstruction?:(name:string, data:string) => void;
        oncomment?:(data:string) => void;
        oncommentend?:() => void;
        oncdatastart?:() => void;
        oncdataend?:() => void;
        onerror?:(error:Error) => void;
        onreset?:() => void;
        onend?:() => void;
    }

    export interface Options {

    }

    export class Parser {
        constructor(handler:Handler);
        write(input:string):void;
        end():void;
        parseComplete(input:string):void;
        reset():void;
    }
}