#!/usr/bin/env node
/**
 * Created by jcabresos on 4/29/2014.
 */

var domer = require('./src/domer');
var program = require('commander');

program
    .version('0.0.0');

program
    .usage("[watch] [source] [target]")
    .description('Domer, HTML to TypeScript Utility')
    .option("-s, --source [source]", "Defines the file or directory to look for files")
    .option("-t, --target [target]", "Defines the directory to put the dompiled files")
    .option("-e, --encoding [target]", "Defines the encoding type of the source files. Default is utf8.", "utf8")
    .option("-m, --mode [mode]", "Defines how dompiler treat DOM ids [strip, resolve, retain]", "strip")
    .parse(process.argv);

console.log("Args:" + process.argv);

var source = program.source ? program.source : process.cwd();
var target = program.target ? program.target : source;

var domerResource = new domer.DomerResource(source, target, program.encoding);

console.log("Source is: " + source);
console.log("Encoding is: " + program.encoding);
console.log("Target is: " + target);

var options;

switch(program.mode) {
    case "resolve":
        options = domer.Options.RESOLVE_IDS;
        console.log("setting mode to resolve ids");
        break;

    case "retain":
        options = domer.Options.RETAIN_IDS;
        console.log("setting mode to retain ids");
        break;

    default:
        options = domer.Options.STRIP_IDS;
        console.log("setting mode to strip ids");
        break;
}

try {
    new domer.Domer(domerResource, options).build();
}
catch(e) {
    console.error(e);
}

