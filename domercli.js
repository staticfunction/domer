#!/usr/bin/env node
/**
 * Created by jcabresos on 4/29/2014.
 */

var domer = require('./src/domer');
var program = require('commander');
var path = require('path');
program
    .version('0.0.12');

program
    .usage("[watch] [source] [target]")
    .description('Domer, HTML to TypeScript Utility')
    .option("-s, --source [source]", "Defines the file pattern of html files. Default is *.html", path.join(process.cwd(), "*.html"))
    .option("-e, --encoding [target]", "Defines the encoding type of the source files. Default is utf8.", "utf8")
    .option("-m, --mode [mode]", "Defines how dompiler treat DOM ids [strip, resolve, retain]", "strip")
    .parse(process.argv);

var source = program.source;

var domerResource = new domer.DomerResource(source, program.encoding);

console.log("Source is: " + source);
console.log("Encoding is: " + program.encoding);

var options;

switch(program.mode) {
    case "resolve":
        options = domer.Mode.RESOLVE_IDS;
        console.log("setting mode to resolve ids");
        break;

    case "retain":
        options = domer.Mode.RETAIN_IDS;
        console.log("setting mode to retain ids");
        break;

    default:
        options = domer.Mode.STRIP_IDS;
        console.log("setting mode to strip ids");
        break;
}

try {
    new domer.Domer(domerResource, options).build();
}
catch(e) {
    console.error(e);
}

