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
    .description('Document Object Modeler')
    .option("-w, --watch", "Watch file or directory for changes.")
    .option("-s, --source [source]", "Defines the file or directory to look for files")
    .option("-t, --target [target]", "defines the file or directory to put the generated declarations")
    .option("-e, --encoding [target]", "defines the encoding type of the source files. Default is utf8.")
    .parse(process.argv);

console.log("Args:" + process.argv);

var source = program.source ? program.source : process.cwd();
var target = program.target ? program.target : source;

var domerResource;

if(program.encoding) {
    domerResource = new domer.DomerResource(source, target, program.encoding);
}
else {
    domerResource = new domer.DomerResource(source, target);
}

console.log("Source is: " + source);
console.log("Target is: " + target);

try {
    if(program.watch)
        new domer.Domer(domerResource).build(true);
    else
        new domer.Domer(domerResource).build();
}
catch(e) {
    console.error(e);
}

