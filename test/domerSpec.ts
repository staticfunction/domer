/// <reference path="../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 6/3/2014.
 */

import domer = require('../src/domer');
import assert = require('assert');
import fs = require('graceful-fs');
import path = require('path');
import glob = require('glob');

var source:string = "test_dummy";

describe("Domer Main", () => {

    it("builds ts file equivalents of each html file with mode \"strip\"", () => {
        var domerInstance = new domer.Domer(new domer.DomerResource(path.join(source,"strip","**","*.html")));
        domerInstance.build();

        assert.equal(domerInstance.mode, domer.Mode.STRIP_IDS);

        glob(domerInstance.domerResource.source, null, (err:Error, files:string[]) => {

            if(err)
                throw err;

            for(var i = 0; i < files.length; i++) {
                var htmlFile:string = files[i];
                var tsFile:string = path.join(path.dirname(htmlFile), path.basename(htmlFile, "html") + "ts");
                assert.ok(fs.existsSync(tsFile), "File not found: " + tsFile);
            }
        });
   });

    it("builds ts file equivalents of each html file with mode \"resolve\"", () => {
        var domerInstance = new domer.Domer(new domer.DomerResource(path.join(source,"resolve","**","*.html")), domer.Mode.RESOLVE_IDS);
        domerInstance.build();

        assert.equal(domerInstance.mode, domer.Mode.RESOLVE_IDS);

        glob(domerInstance.domerResource.source, null, (err:Error, files:string[]) => {

            if(err)
                throw err;

            for(var i = 0; i < files.length; i++) {
                var htmlFile:string = files[i];
                var tsFile:string = path.join(path.dirname(htmlFile), path.basename(htmlFile, "html") + "ts");
                assert.ok(fs.existsSync(tsFile), "File not found: " + tsFile);
            }
        });
   });

    it("builds ts file equivalents of each html file with mode \"retain\"", () => {
        var domerInstance = new domer.Domer(new domer.DomerResource(path.join(source,"retain","**","*.html")), domer.Mode.RETAIN_IDS);
        domerInstance.build();

        assert.equal(domerInstance.mode, domer.Mode.RETAIN_IDS);

        glob(domerInstance.domerResource.source, null, (err:Error, files:string[]) => {

            if(err)
                throw err;

            for(var i = 0; i < files.length; i++) {
                var htmlFile:string = files[i];
                var tsFile:string = path.join(path.dirname(htmlFile), path.basename(htmlFile, "html") + "ts");
                assert.ok(fs.existsSync(tsFile), "File not found: " + tsFile);
            }
        });
    })
});

