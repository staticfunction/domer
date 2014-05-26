/// <reference path="../../typings/tsd.d.ts"/>
/**
 * Created by jcabresos on 5/20/2014.
 */
import dompiler = require('../../src/typescript/dompiler');
import fs = require('fs');

var strip_ids_output:string = fs.readFileSync(__dirname + "/output/createinstructions/chat_strip_ids.txt", "UTF-8");
var strip_id_template:string = fs.readFileSync("src/typescript/resources/code_template_strip_id.json", "UTF-8");