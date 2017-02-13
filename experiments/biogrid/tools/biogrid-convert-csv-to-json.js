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

let fs = require("fs");
let Converter = require("csvtojson").Converter;
let converter = new Converter({delimiter: 'auto'});

converter.fromFile("../biogrid3/BioGridFunction3",function(err,result){
  console.log(result);

  let strResult = JSON.stringify(result);

  fs.writeFile("../biogrid3/biogrid3.json", strResult, function (err) {
    if (err) throw err;
    console.log('BioGrid saved!');
  });
});
