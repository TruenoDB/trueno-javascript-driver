var fs = require('fs');
var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: 'auto'});
converter.fromFile("./BioGridDB2.tsv",function(err,result){
	  console.log(result);

	  var strResult = JSON.stringify(result);

	fs.writeFile('biogrid2.json', strResult, function (err) {
	  if (err) throw err;
	  console.log('BioGrid2 saved!');
	});
});