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
 * Do NOT forget to reference the ORIGINAL author of the code. Be nice!
 */

let json2csv = require("json2csv");
let fs = require("fs");
let requiredArguments = 4;
let totalArguments = process.argv.length;

if( !(totalArguments==requiredArguments) ) {
  console.log("[usage] node biogrid-generate-csv-from-json.js ./fields.json ./origin.json ./destination.csv");
}
else{

  //console.log(text);
  const edges = require(process.argv[2]);
  const destinationCSV = process.argv[3];

  let fields = ["source", "destination"];//, "label"];
  //let fields = ["id", "label", "name"];

  let csv = json2csv({ data: edges, fields: fields });

  fs.writeFile(destinationCSV, csv, function(err) {
    if (err) throw err;
    console.log(destinationCSV + " file saved");
  });

}



