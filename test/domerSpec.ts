/// <reference path="../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 6/3/2014.
 */

import domer = require('../src/domer');
import assert = require('assert');
import fs = require('fs');
import path = require('path');
import glob = require('glob');

var source:string = "test_dummy/**/*.html";
var generated:string = "test_dummy/**/*.ts";

describe("Domer Main", () => {

    beforeEach(() => {
        glob(generated, null, (err:Error, files:string[]) => {
            if(!files)
                return;

            while(files.length > 0)
                fs.unlinkSync(files.pop());
        })
    })

    it("builds ts file equivalents of each html file with mode \"strip\"", () => {
        var domerInstance = new domer.Domer(new domer.DomerResource(source));
        domerInstance.build();

        assert.equal(domerInstance.mode, domer.Mode.STRIP_IDS);

        glob(source, null, (err:Error, files:string[]) => {

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
        var domerInstance = new domer.Domer(new domer.DomerResource(source), domer.Mode.RESOLVE_IDS);
        domerInstance.build();

        assert.equal(domerInstance.mode, domer.Mode.RESOLVE_IDS);

        glob(source, null, (err:Error, files:string[]) => {

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
        var domerInstance = new domer.Domer(new domer.DomerResource(source), domer.Mode.RETAIN_IDS);
        domerInstance.build();

        assert.equal(domerInstance.mode, domer.Mode.RETAIN_IDS);

        glob(source, null, (err:Error, files:string[]) => {

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

