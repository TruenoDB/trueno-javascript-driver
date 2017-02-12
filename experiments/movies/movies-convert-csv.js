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
const files= ['directorfilm', 'genres', 'films', 'filmgenre', 'directors'];

function convert(fn) {

  let src = `./datasets/movie/${fn}.csv`;
  let dst = `./datasets/movie/${fn}.json`;
  let converter = new Converter({delimiter: 'auto'});

  converter.fromFile(src,function(err,result){
    //console.log(result);

    let strResult = JSON.stringify(result);

    fs.writeFile(dst, strResult, function (err) {
      if (err) throw err;
      console.log(`File ${fn} saved!`);
    });
  });

}

files.forEach((item) => {
  convert(item);
});



