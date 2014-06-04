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

export class Resource {

    path:string;
    stats:fs.Stats;

    constructor(path:string) {
        this.path = path;
        this.stats = this.getFileOrDirectoryStats(path);
    }

    getFileOrDirectoryStats(path:string):fs.Stats {
        if(!path)
            return null;

        try {
            var pathStats:fs.Stats = fs.statSync(path);

            if(pathStats.isFile() || pathStats.isDirectory())
                return pathStats;
            else
                throw new Error("Path is not a file nor a directory.");
        }
        catch(e) {
            throw new Error("No such file or directory: " + path);
        }
    }
}

export class Domer {

    source:string;
    target:string;
    options:Options;



    constructor(source:string, target:string, options:Options = Options.STRIP_IDS) {
        this.source = source;
        this.target = target;
        this.options = options;
    }

    build(): void {

        //this.load(this.source);

        glob(this.source, null, (err:Error, files:string[]) => {

            if(files) {
               for(var i = 0; i < files.length; i++) {
                   console.log("loaded file: " + files[i]);
               }
            }
        });

        setTimeout((target:Resource) => {
            console.log("Finished and deployed to: " + target);
        }, 1000, this.target);
    }

    load(resource:Resource):void {
        if(resource.stats.isDirectory()) {
            console.log("getting list from dir: " + resource.path);

            var files:string[] = fs.readdirSync(resource.path);
            for (var i = 0; i < files.length; i++) {
                this.load(new Resource(path.join(resource.path, files[i])));
            }
        }
        else {
            var content:string = fs.readFileSync(resource.path,"utf8");

            console.log("loaded file from: " + resource.path);
            console.log(content);
        }
    }

    watch(): void {

        setInterval(() => {
            console.log('checking for changes...');
            console.log('no updates ' + new Date().getTime());
        }, 1000)
        console.log("watchcing from path: " + this.source);
    }
}