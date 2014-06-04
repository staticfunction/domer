/**
 * Created by jcabresos on 6/4/2014.
 */
declare module "glob" {
    function glob(pattern:string, options:any, callback:(error:Error, files:string[]) => void):void;
    export = glob;
}