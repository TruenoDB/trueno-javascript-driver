"use strict";

/**
 * twitter-graph-populate-vertices.js
 * This file generates bulk requests to the ES socket server, and import
 * vertices data.
 *
 * @version 0.0.0.1
 * @author  ebarsallo
 *
 * @module experiments/twitter
 * @see lib/trueno
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code.
 */

/* import modules */
const ProgressBar = require('progress');
const Promise = require("bluebird");
const Socket = require("uws");
const fs = require("fs");

/* websocket */
// var ws = new Socket('ws://localhost:8007');
var ws = new Socket('ws://127.0.0.1:8007');

var callbacks = {};

/* variables to keep track of batches and progress */
var limit = 10000000;
var counter = 0;

/* keeps the current batch to be sent */
var bulkOperations = [];

/* Elastic Search Index to be used */
const indexName = "twitter";
const typeName = "v";

/* source datasets/documents */
const input = [
/*
  '/tmp/data/vertices-0000.json',
  '/tmp/data/vertices-0001.json',
  '/tmp/data/vertices-0002.json',
  '/tmp/data/vertices-0003.json',
  '/tmp/data/vertices-0004.json',
  '/tmp/data/vertices-0005.json',
  '/tmp/data/vertices-0006.json',
  '/tmp/data/vertices-0007.json',
  '/tmp/data/vertices-0008.json',
  '/tmp/data/vertices-0009.json',
  '/tmp/data/vertices-0010.json',
  '/tmp/data/vertices-0011.json',
  '/tmp/data/vertices-0012.json',
  '/tmp/data/vertices-0013.json',
  '/tmp/data/vertices-0014.json',
  '/tmp/data/vertices-0015.json',
  '/tmp/data/vertices-0016.json',
  '/tmp/data/vertices-0017.json',
  '/tmp/data/vertices-0018.json',
  '/tmp/data/vertices-0019.json',
  '/tmp/data/vertices-0020.json',
  '/tmp/data/vertices-0021.json',
  '/tmp/data/vertices-0022.json',
  '/tmp/data/vertices-0023.json',
  '/tmp/data/vertices-0024.json',
  '/tmp/data/vertices-0025.json',
  '/tmp/data/vertices-0026.json',
  '/tmp/data/vertices-0027.json',
  '/tmp/data/vertices-0028.json',
  '/tmp/data/vertices-0029.json',
  '/tmp/data/vertices-0030.json',
  '/tmp/data/vertices-0031.json',
  '/tmp/data/vertices-0032.json',
  '/tmp/data/vertices-0033.json',
  '/tmp/data/vertices-0034.json',
  '/tmp/data/vertices-0035.json',
  '/tmp/data/vertices-0036.json',
  '/tmp/data/vertices-0037.json',
  '/tmp/data/vertices-0038.json',
  '/tmp/data/vertices-0039.json', 
  '/tmp/data/vertices-0040.json',
  '/tmp/data/vertices-0041.json',
  '/tmp/data/vertices-0042.json',
  '/tmp/data/vertices-0043.json',
  '/tmp/data/vertices-0044.json',
  '/tmp/data/vertices-0045.json',
  '/tmp/data/vertices-0046.json',
  '/tmp/data/vertices-0047.json',
  '/tmp/data/vertices-0048.json',
  '/tmp/data/vertices-0049.json',
  '/tmp/data/vertices-0050.json',
  '/tmp/data/vertices-0051.json',
  '/tmp/data/vertices-0052.json',
  '/tmp/data/vertices-0053.json',
  '/tmp/data/vertices-0054.json',
  '/tmp/data/vertices-0055.json',
  '/tmp/data/vertices-0056.json',
  '/tmp/data/vertices-0057.json',
  '/tmp/data/vertices-0058.json',
  '/tmp/data/vertices-0059.json',
  '/tmp/data/vertices-0060.json',
  '/tmp/data/vertices-0061.json',
  '/tmp/data/vertices-0062.json',
  '/tmp/data/vertices-0063.json',
  '/tmp/data/vertices-0064.json',
  '/tmp/data/vertices-0065.json',
  '/tmp/data/vertices-0066.json',
  '/tmp/data/vertices-0067.json',
  '/tmp/data/vertices-0068.json',
  '/tmp/data/vertices-0069.json',
  '/tmp/data/vertices-0070.json',
  '/tmp/data/vertices-0071.json',
  '/tmp/data/vertices-0072.json',
  '/tmp/data/vertices-0073.json',
  '/tmp/data/vertices-0074.json',
  '/tmp/data/vertices-0075.json',
  '/tmp/data/vertices-0076.json',
  '/tmp/data/vertices-0077.json',
  '/tmp/data/vertices-0078.json',
  '/tmp/data/vertices-0079.json',
  '/tmp/data/vertices-0080.json',
  '/tmp/data/vertices-0081.json',
  '/tmp/data/vertices-0082.json',
  '/tmp/data/vertices-0083.json',
  '/tmp/data/vertices-0084.json',
  '/tmp/data/vertices-0085.json',
  '/tmp/data/vertices-0086.json',
  '/tmp/data/vertices-0087.json',
  '/tmp/data/vertices-0088.json',
  '/tmp/data/vertices-0089.json',
  '/tmp/data/vertices-0090.json',
  '/tmp/data/vertices-0091.json',
  '/tmp/data/vertices-0092.json',
  '/tmp/data/vertices-0093.json',
  '/tmp/data/vertices-0094.json',
  '/tmp/data/vertices-0095.json',
  '/tmp/data/vertices-0096.json',
  '/tmp/data/vertices-0097.json',
  '/tmp/data/vertices-0098.json',
  '/tmp/data/vertices-0099.json',
  '/tmp/data/vertices-0100.json',
  '/tmp/data/vertices-0101.json',
  '/tmp/data/vertices-0102.json',
  '/tmp/data/vertices-0103.json',
  '/tmp/data/vertices-0104.json',
  '/tmp/data/vertices-0105.json',
  '/tmp/data/vertices-0106.json',
  '/tmp/data/vertices-0107.json',
  '/tmp/data/vertices-0108.json',
  '/tmp/data/vertices-0109.json',
  '/tmp/data/vertices-0110.json',
  '/tmp/data/vertices-0111.json',
  '/tmp/data/vertices-0112.json',
  '/tmp/data/vertices-0113.json',
  '/tmp/data/vertices-0114.json',
  '/tmp/data/vertices-0115.json',
  '/tmp/data/vertices-0116.json',
  '/tmp/data/vertices-0117.json',
  '/tmp/data/vertices-0118.json',
  '/tmp/data/vertices-0119.json',
  '/tmp/data/vertices-0120.json',
  '/tmp/data/vertices-0121.json',
  '/tmp/data/vertices-0122.json',
  '/tmp/data/vertices-0123.json',
*/
  '/tmp/data/vertices-0124.json',
  '/tmp/data/vertices-0125.json',
  '/tmp/data/vertices-0126.json',
  '/tmp/data/vertices-0127.json',
  '/tmp/data/vertices-0128.json',
  '/tmp/data/vertices-0129.json',
  '/tmp/data/vertices-0130.json',
  '/tmp/data/vertices-0131.json',
  '/tmp/data/vertices-0132.json',
  '/tmp/data/vertices-0133.json',
  '/tmp/data/vertices-0134.json',
  '/tmp/data/vertices-0135.json',
  '/tmp/data/vertices-0136.json',
  '/tmp/data/vertices-0137.json',
  '/tmp/data/vertices-0138.json',
  '/tmp/data/vertices-0139.json',
  '/tmp/data/vertices-0140.json',
  '/tmp/data/vertices-0141.json',
  '/tmp/data/vertices-0142.json',
  '/tmp/data/vertices-0143.json',
  '/tmp/data/vertices-0144.json',
  '/tmp/data/vertices-0145.json',
  '/tmp/data/vertices-0146.json',
  '/tmp/data/vertices-0147.json',
  '/tmp/data/vertices-0148.json',
  '/tmp/data/vertices-0149.json',
  '/tmp/data/vertices-0150.json',
  '/tmp/data/vertices-0151.json',
  '/tmp/data/vertices-0152.json',
  '/tmp/data/vertices-0153.json',
  '/tmp/data/vertices-0154.json',
  '/tmp/data/vertices-0155.json',
  '/tmp/data/vertices-0156.json',
  '/tmp/data/vertices-0157.json',
  '/tmp/data/vertices-0158.json',
  '/tmp/data/vertices-0159.json',
  '/tmp/data/vertices-0160.json',
  '/tmp/data/vertices-0161.json',
  '/tmp/data/vertices-0162.json',
  '/tmp/data/vertices-0163.json',
  '/tmp/data/vertices-0164.json',
  '/tmp/data/vertices-0165.json',
  '/tmp/data/vertices-0166.json',
  '/tmp/data/vertices-0167.json',
  '/tmp/data/vertices-0168.json',
  '/tmp/data/vertices-0169.json',
  '/tmp/data/vertices-0170.json',
  '/tmp/data/vertices-0171.json',
  '/tmp/data/vertices-0172.json',
  '/tmp/data/vertices-0173.json',
  '/tmp/data/vertices-0174.json',
  '/tmp/data/vertices-0175.json',
  '/tmp/data/vertices-0176.json',
  '/tmp/data/vertices-0177.json',
  '/tmp/data/vertices-0178.json',
  '/tmp/data/vertices-0179.json',
  '/tmp/data/vertices-0180.json',
  '/tmp/data/vertices-0181.json',
  '/tmp/data/vertices-0182.json',
  '/tmp/data/vertices-0183.json',
  '/tmp/data/vertices-0184.json',
  '/tmp/data/vertices-0185.json',
  '/tmp/data/vertices-0186.json',
  '/tmp/data/vertices-0187.json',
  '/tmp/data/vertices-0188.json',
  '/tmp/data/vertices-0189.json',
  '/tmp/data/vertices-0190.json',
  '/tmp/data/vertices-0191.json',
  '/tmp/data/vertices-0192.json',
  '/tmp/data/vertices-0193.json',
  '/tmp/data/vertices-0194.json',
  '/tmp/data/vertices-0195.json',
  '/tmp/data/vertices-0196.json',
  '/tmp/data/vertices-0197.json',
  '/tmp/data/vertices-0198.json',
  '/tmp/data/vertices-0199.json',
  '/tmp/data/vertices-0200.json',
  '/tmp/data/vertices-0201.json',
  '/tmp/data/vertices-0202.json',
  '/tmp/data/vertices-0203.json',
  '/tmp/data/vertices-0204.json',
  '/tmp/data/vertices-0205.json',
  '/tmp/data/vertices-0206.json',
  '/tmp/data/vertices-0207.json',
  '/tmp/data/vertices-0208.json'
];

/* vertices */
let vertices;

/* amount of records per request */
const batchSize  = 500;

/* set this variable to vertices if you want that kind of documents */
let vQueue;

/* set this variable to edges if you want that kind of documents */
//let vQueue = Object.keys(edges);

let total, current = 0;

/* set this variables to simulate delete or insert */
var strRequest = "persist";
//var strRequest = "destroy";

/* showing request progress bar */
var previous = 0;
var bar = new ProgressBar("ElasticSearch Bulk Request [:bar] :percent :elapsed", {
  complete: '=',
  incomplete: ' ',
  width: 40,
  total: 100
});

/**
 * Insert/Delete Vertices/Edges per batches
 * @param operations -> [][]
 */
function bulkESRequest(operations) {

  return new Promise((resolve, reject) => {
    if(++counter <= limit){

      /* the payload object */
      var internal = {
        index: indexName,
        operations: operations
      };
      var payload = {
        callbackIndex: 'bulk1',
        action: "bulk",
        object: internal
      };

      /* sending the payload */
      ws.send(JSON.stringify(payload));
      /* adding callback */
      callbacks['bulk1'] = function(){
        total++;
        resolve();
      };
    }
  });

}//bulkESRequest

/**
 * Pushes the operation string and parameter into the bulk list.
 * @param {string} op - The operation to be inserted into the bulk list.
 * @param {object} obj - The operation object.
 */
function pushOperation(op, obj){
  bulkOperations.push({op: op, content: obj});
}

/**
 * insert/delete vertices/edges in batch function
 * @param arr
 * @param op
 */
function insertDeleteVertices(arr, op, resolve, reject) {

  /* Persist all vertices */
  arr.forEach((vkey)=> {
    let v = {};
    v.id = null;
    v._label = null;
    v._prop = {};

    v.id = parseInt(vkey);

    for (let prop in vertices[vkey]) {
      if (prop == "label") {
        v._label = vertices[vkey][prop];
      } else {
        v._prop[prop] = vertices[vkey][prop];
      }
    }//for

    /* building the message */
    let payload = {
      graph: indexName,
      type: typeName,
      obj: v
    };

    if(op === "persist"){
      pushOperation("ex_persist", payload);
    }else{
      pushOperation("ex_destroy", payload);
    }

    current++;
  });

  /* send vertices' batches to the socket server */
  _bulk().then( (result) => {

    //console.log("Vertices batch created.", current / total);
    var currentTick = Math.floor(current/total*100);
    if(currentTick>previous){
      previous = currentTick;
      // console.log(thickness);
      // bar.tick();
    }

    /* Continue inserting */
    if (vQueue.length) {
      insertDeleteVertices(vQueue.splice(0, batchSize), op, resolve, reject);
    }else{
      console.timeEnd("time");
      resolve();
      // process.exit();
    }

  }, (error) => {

    console.log("Error: Vertices batch creation failed.", error, current / total);
    /* Continue inserting */
    if (vQueue.length) {
      insertDeleteVertices(vQueue.splice(0, batchSize), op, resolve, reject);
    } else {
      reject(error);
      // process.exit();
    }

  });

}//insertVertex

/**
 * Builds bulk array request
 * @param b
 * @param reject
 * @returns {Array}
 */
function buildBulkOperations(b, reject) {

  /* the bulk operations array */
  let operations = [];
  var arrOperations = [];

  /* for each operation build the bulk corresponding operation */
  b.forEach((e)=> {
    /* content to be constructed according to the operation */
    let meta = {};
    switch (e.op) {
      case 'ex_persist':
        meta = {"index": {"_type": e.content.type}};
        /* setting id if present */
        if (!Number.isInteger(e.content.obj.id)) {
          reject('All vertices and edges must have an integer id');
          return;
        }
        /* setting id if present */
        meta.index._id = e.content.obj.id;

        /* adding meta */
        operations.push(meta);

        /* adding content */
        operations.push(e.content.obj);

        /* adding operations */
        arrOperations.push(["index",e.content.type,e.content.obj.id.toString(),
          JSON.stringify(e.content.obj)]);

        break;
      case 'ex_destroy':
        meta = {"delete": {"_type": e.content.type, _id: e.content.obj.id}};
        /* adding meta */
        operations.push(meta);

        /* I use this 2d array - adding operations */
        arrOperations.push(["delete",e.content.type,e.content.obj.id.toString()]);
        break;
    }
  });

  return arrOperations;

}//buildBulk

/**
 * Execute all operation in the batch on one call.
 * @return {Promise} - the Promise with the bulk operations results.
 */
function _bulk() {

  let operations = buildBulkOperations(bulkOperations);

  /* if no operations to submit return empty promise */
  if (bulkOperations.length === 0) {

    return new Promise((resolve, reject)=> {
      resolve({
        took: 0,
        errors: false,
        items: []
      });
    });

  }//if no operations

  /* return promise with the async operation */
  return new Promise((resolve, reject)=> {

    /* call Elastic Search Bulk Request */
    bulkESRequest(operations).then((results)=> {

      /* prepare array to take new batch of vertices/edges */
      bulkOperations = [];

      /* resolve the promise with the results */
      resolve(results);

    }, (err)=> {

      reject(err);

    });

  });

}//_bulk

/**
 * Uses vertices queue to create bulkOperations
 */
function buildVerticesFromJSON(resolve, reject){
  /* Initiating vertex insertion */
  insertDeleteVertices(vQueue.splice(0, batchSize), strRequest, resolve, reject);
}

/**
 * Process each input file, and insert the records onto the database
 * @param data
 */
function doProcess(data) {

  /* load vertices */
  vertices = require (data);
  console.log(data);
  /* get keys from input data */
  vQueue = Object.keys(vertices);
  /* total keys to process on the iteration */
  total = vQueue.length;

  console.time("time");
  /* start bulk read and request to socket server */
  return new Promise((resolve, reject) => {
    buildVerticesFromJSON(resolve, reject);
  });

}

/**
 * Loop over all input files
 */
function doLoop() {

  let promise = doProcess(input.shift());

  promise.then(() => {
    if (input.length > 0) {
      doLoop();
    } else {
      console.log('done!');
    }
  });

}

ws.on('open', function open() {
  console.log('connected');

  /* loop over all input entries */
  doLoop();

});

ws.on('error', function error() {
  console.log('Error connecting!');
});

ws.on('message', function(data, flags) {
  var obj = JSON.parse(data);
  //console.log(obj);
  /* invoke the callback */
  callbacks[obj.callbackIndex]();

  // process.stdout.write('.');

});

ws.on('close', function(code, message) {
  console.log('Disconnection: ' + code + ', ' + message);
});
