/// <reference path="../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 4/30/2014.
 */
import fs = require('graceful-fs');

class DomerResource {

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

export = DomerResource;