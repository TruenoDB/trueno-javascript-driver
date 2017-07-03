/**
 * biogrid-generate-csv-from-json.js
 * This file generates csvs according to source (json)
 *
 * @version 0.0.1
 * @author  maverick-zhn(Servio Palacios)
 * @updated 2017.02.13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code.
 * */

let fs = require("fs");
let Converter = require("csvtojson").Converter;
let converter = new Converter({delimiter: '|'});

let requiredArguments = 3;
let totalArguments = process.argv.length;

/* Instantiate connection */

if( !(totalArguments==requiredArguments) ) {
  console.log("[usage] node ldbc-convert-csv-to-json.js graph");
  process.exit(0)
}

const destinationGraph = process.argv[2].toString();

converter.fromFile("./social_network_scale_" + destinationGraph +
                   "_1/person_knows_person_0_0.csv",function(err,result){
  console.log(result);

  let strResult = JSON.stringify(result);

  fs.writeFile("./datasets/" + destinationGraph + "/ldbc-" + destinationGraph +
               "-vertices-edges-source.json", strResult, function (err) {
    if (err) throw err;
    console.log('ldbc vertices edges saved!');
  });
});
