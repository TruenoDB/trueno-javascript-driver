/**
 * ldbc-generate-csv-from-json.js
 * This file generates csvs according to source (json)
 *
 * @version 0.0.1
 * @author  Victor Santos, maverick-zhn(Servio Palacios)
 * @updated 2017.02.13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code. Be nice!
 */

let requiredArguments = 3;
let totalArguments = process.argv.length;

/* Instantiate connection */

if( !(totalArguments==requiredArguments) ) {
  console.log("[usage] node ldbc-generate-vertices-edges.js graph");
  process.exit(0)
}

const destinationGraph = process.argv[2].toString();

let fs = require("fs");
const ldbc = require("./datasets/" + destinationGraph + "/ldbc-"+ destinationGraph + "-vertices-edges-source.json");

  let currentVertex = 1;
  let currentEdge = 1;
  let h = {};
  let verticesJSON = {};
  let arrVerticesNeo4jJSON = [];
  let edgesJSON = {};
  let arrEdgesJSON = [];

  let edgeSource = 0;
  let edgeDestination = 0;

  let countVertex = 0;

  /* Iterate all vertices */
  ldbc.forEach((edge)=> {

     let intSource = parseInt(edge.source);

     if (h.hasOwnProperty(intSource)) {
       edgeSource = h[edge.source].id;
     }
     else{
       currentVertex = intSource;
       h[intSource] = {};
       h[intSource].id = currentVertex;
       verticesJSON[currentVertex.toString()] = {};
       verticesJSON[currentVertex.toString()].id = currentVertex.toString();//last edition
       verticesJSON[currentVertex.toString()].label = "knows";
       verticesJSON[currentVertex.toString()].name = "generated";
       //arrVerticesNeo4jJSON.push(verticesJSON[currentVertex.toString()]);
       edgeSource = currentVertex;
       //currentVertex++;
       countVertex++;
     }

     let intDestination = parseInt(edge.destination);

     if (h.hasOwnProperty(intDestination)) {
       edgeDestination = h[intDestination].id;
     }
     else{
       currentVertex = intDestination;
       h[intDestination] = {};
       h[intDestination].id = currentVertex;
       verticesJSON[currentVertex.toString()] = {};
       verticesJSON[currentVertex.toString()].id = currentVertex.toString();//last edition
       verticesJSON[currentVertex.toString()].label = "knows";
       verticesJSON[currentVertex.toString()].name = edge.destination;
       //arrVerticesNeo4jJSON.push(verticesJSON[currentVertex.toString()]);
       edgeDestination = currentVertex;
       //currentVertex++;
       countVertex++;
     }

     edgesJSON[currentEdge] = {};
     edgesJSON[currentEdge].source = edgeSource;
     edgesJSON[currentEdge].destination = edgeDestination;
     edgesJSON[currentEdge].label = "knows";
     arrEdgesJSON.push(edgesJSON[currentEdge]);
     currentEdge++;

   });

console.log("Total vertices ", countVertex);
console.log("Total edges ", currentEdge);

//var str2 = JSON.stringify(as);
let strVertices = JSON.stringify(verticesJSON);

fs.writeFile("./datasets/" + destinationGraph + "/ldbc-" + destinationGraph +
             "-vertices.json", strVertices, function (err) {
  if (err) throw err;
  console.log('Vertices saved!');
});

//let strArrVertices = JSON.stringify(arrVerticesNeo4jJSON);

/*
fs.writeFile('./datasets/ldbc-vertices-neo4j.json', strArrVertices, function (err) {
  if (err) throw err;
  console.log('Vertices saved!');
});
*/

let strArrEdges = JSON.stringify(arrEdgesJSON);

fs.writeFile("./datasets/" + destinationGraph + "/ldbc-" + destinationGraph +
             "-edges.json", strArrEdges, function (err) {
  if (err) throw err;
  console.log('Edges saved!');
});




