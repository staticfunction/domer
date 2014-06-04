/// <reference path="../typings/tsd.d.ts"/>

/**
 * Created by jcabresos on 6/3/2014.
 */

import domer = require("../src/domer");

var source:string = __dirname + "/typescript";

describe("domer main", () => {


    it("loads everything specified in source", (done:MochaDone) => {
        var domBuilder:domer.Domer = new domer.Domer(source, source);
        domBuilder.build();

        done();
    });
})