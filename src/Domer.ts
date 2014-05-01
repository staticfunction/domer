/// <reference path="../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 4/29/2014.
 */
import DomerResource = require('./DomerResource');

class Domer {

    source:DomerResource;
    target:DomerResource;

    constructor(source:string, target:string) {
        this.source = new DomerResource(source);
        this.target = new DomerResource(target);
    }

    build(): void {
        console.log("building from path: " + this.source.path);
        setTimeout((target:DomerResource) => {
            console.log("Finished and deployed to: " + target.path);
        }, 1000, this.target);
    }

    watch(): void {

        setInterval(() => {
            console.log('checking for changes...');
            console.log('no updates ' + new Date().getTime());
        }, 1000)
        console.log("watchcing from path: " + this.source.path);
    }
}

export = Domer;