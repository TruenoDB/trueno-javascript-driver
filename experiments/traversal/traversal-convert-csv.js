"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');
const Converter = require("csvtojson").Converter;
const csv = require('csvtojson');
const files= ['nodes', 'rels'];

function convert(fn) {

  let src = `./data/${fn}.csv`;
  let dst = `./data/${fn}.json`;
  let converter = new Converter({delimiter: 'auto', toArrayString: 'true'});

  // converter
  //   .fromFile(src, function(err,result) {
  //     // console.log(result);
  //
  //     let strResult = JSON.stringify(result);
  //
  //     fs.writeFile(dst, strResult, function (err) {
  //       if (err) throw err;
  //       console.log(`File ${fn} saved!`);
  //     });
  //   });

  csv({delimiter: 'auto'})
    .fromFile(src, function(err,result) {
      // console.log(result);

      let strResult = JSON.stringify(result);

      fs.writeFile(dst, strResult, function (err) {
        if (err) throw err;
        console.log(`File ${fn} saved!`);
      });
    })
    .on('csv', csvRow => {
      // console.log('-->', csvRow)
    });

}

files.forEach(item => {
  convert(item);
});



