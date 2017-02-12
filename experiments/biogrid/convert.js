let fs = require("fs");
let Converter = require("csvtojson").Converter;
let converter = new Converter({delimiter: 'auto'});

converter.fromFile("./biogrid-sorted-unique.csv",function(err,result){
	  console.log(result);

	  let strResult = JSON.stringify(result);

	fs.writeFile("biogrid.json", strResult, function (err) {
	  if (err) throw err;
	  console.log('BioGrid saved!');
	});
});
