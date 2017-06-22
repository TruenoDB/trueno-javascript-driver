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
  '/tmp/data/vertices-0000',
  '/tmp/data/vertices-0001',
  '/tmp/data/vertices-0002',
  '/tmp/data/vertices-0003',
  '/tmp/data/vertices-0004',
  '/tmp/data/vertices-0005',
  '/tmp/data/vertices-0006',
  '/tmp/data/vertices-0007',
  '/tmp/data/vertices-0008',
  '/tmp/data/vertices-0009',
  '/tmp/data/vertices-0010',
  '/tmp/data/vertices-0011',
  '/tmp/data/vertices-0012',
  '/tmp/data/vertices-0013',
  '/tmp/data/vertices-0014',
  '/tmp/data/vertices-0015',
  '/tmp/data/vertices-0016',
  '/tmp/data/vertices-0017',
  '/tmp/data/vertices-0018',
  '/tmp/data/vertices-0019',
  '/tmp/data/vertices-0020',
  '/tmp/data/vertices-0021',
  '/tmp/data/vertices-0022',
  '/tmp/data/vertices-0023',
  '/tmp/data/vertices-0024',
  '/tmp/data/vertices-0025',
  '/tmp/data/vertices-0026',
  '/tmp/data/vertices-0027',
  '/tmp/data/vertices-0028',
  '/tmp/data/vertices-0029',
  '/tmp/data/vertices-0030',
  '/tmp/data/vertices-0031',
  '/tmp/data/vertices-0032',
  '/tmp/data/vertices-0033',
  '/tmp/data/vertices-0034',
  '/tmp/data/vertices-0035',
  '/tmp/data/vertices-0036',
  '/tmp/data/vertices-0037',
  '/tmp/data/vertices-0038',
  '/tmp/data/vertices-0039',
  '/tmp/data/vertices-0040',
  '/tmp/data/vertices-0041',
  '/tmp/data/vertices-0042',
  '/tmp/data/vertices-0043',
  '/tmp/data/vertices-0044',
  '/tmp/data/vertices-0045',
  '/tmp/data/vertices-0046',
  '/tmp/data/vertices-0047',
  '/tmp/data/vertices-0048',
  '/tmp/data/vertices-0049',
  '/tmp/data/vertices-0050',
  '/tmp/data/vertices-0051',
  '/tmp/data/vertices-0052',
  '/tmp/data/vertices-0053',
  '/tmp/data/vertices-0054',
  '/tmp/data/vertices-0055',
  '/tmp/data/vertices-0056',
  '/tmp/data/vertices-0057',
  '/tmp/data/vertices-0058',
  '/tmp/data/vertices-0059',
  '/tmp/data/vertices-0060',
  '/tmp/data/vertices-0061',
  '/tmp/data/vertices-0062',
  '/tmp/data/vertices-0063',
  '/tmp/data/vertices-0064',
  '/tmp/data/vertices-0065',
  '/tmp/data/vertices-0066',
  '/tmp/data/vertices-0067',
  '/tmp/data/vertices-0068',
  '/tmp/data/vertices-0069',
  '/tmp/data/vertices-0070',
  '/tmp/data/vertices-0071',
  '/tmp/data/vertices-0072',
  '/tmp/data/vertices-0073',
  '/tmp/data/vertices-0074',
  '/tmp/data/vertices-0075',
  '/tmp/data/vertices-0076',
  '/tmp/data/vertices-0077',
  '/tmp/data/vertices-0078',
  '/tmp/data/vertices-0079',
  '/tmp/data/vertices-0080',
  '/tmp/data/vertices-0081',
  '/tmp/data/vertices-0082',
  '/tmp/data/vertices-0083',
  '/tmp/data/vertices-0084',
  '/tmp/data/vertices-0085',
  '/tmp/data/vertices-0086',
  '/tmp/data/vertices-0087',
  '/tmp/data/vertices-0088',
  '/tmp/data/vertices-0089',
  '/tmp/data/vertices-0090',
  '/tmp/data/vertices-0091',
  '/tmp/data/vertices-0092',
  '/tmp/data/vertices-0093',
  '/tmp/data/vertices-0094',
  '/tmp/data/vertices-0095',
  '/tmp/data/vertices-0096',
  '/tmp/data/vertices-0097',
  '/tmp/data/vertices-0098',
  '/tmp/data/vertices-0099',
  '/tmp/data/vertices-0100',
  '/tmp/data/vertices-0101',
  '/tmp/data/vertices-0102',
  '/tmp/data/vertices-0103',
  '/tmp/data/vertices-0104',
  '/tmp/data/vertices-0105',
  '/tmp/data/vertices-0106',
  '/tmp/data/vertices-0107',
  '/tmp/data/vertices-0108',
  '/tmp/data/vertices-0109',
  '/tmp/data/vertices-0110',
  '/tmp/data/vertices-0111',
  '/tmp/data/vertices-0112',
  '/tmp/data/vertices-0113',
  '/tmp/data/vertices-0114',
  '/tmp/data/vertices-0115',
  '/tmp/data/vertices-0116',
  '/tmp/data/vertices-0117',
  '/tmp/data/vertices-0118',
  '/tmp/data/vertices-0119',
  '/tmp/data/vertices-0120',
  '/tmp/data/vertices-0121',
  '/tmp/data/vertices-0122',
  '/tmp/data/vertices-0123',
  '/tmp/data/vertices-0124',
  '/tmp/data/vertices-0125',
  '/tmp/data/vertices-0126',
  '/tmp/data/vertices-0127',
  '/tmp/data/vertices-0128',
  '/tmp/data/vertices-0129',
  '/tmp/data/vertices-0130',
  '/tmp/data/vertices-0131',
  '/tmp/data/vertices-0132',
  '/tmp/data/vertices-0133',
  '/tmp/data/vertices-0134',
  '/tmp/data/vertices-0135',
  '/tmp/data/vertices-0136',
  '/tmp/data/vertices-0137',
  '/tmp/data/vertices-0138',
  '/tmp/data/vertices-0139',
  '/tmp/data/vertices-0140',
  '/tmp/data/vertices-0141',
  '/tmp/data/vertices-0142',
  '/tmp/data/vertices-0143',
  '/tmp/data/vertices-0144',
  '/tmp/data/vertices-0145',
  '/tmp/data/vertices-0146',
  '/tmp/data/vertices-0147',
  '/tmp/data/vertices-0148',
  '/tmp/data/vertices-0149',
  '/tmp/data/vertices-0150',
  '/tmp/data/vertices-0151',
  '/tmp/data/vertices-0152',
  '/tmp/data/vertices-0153',
  '/tmp/data/vertices-0154',
  '/tmp/data/vertices-0155',
  '/tmp/data/vertices-0156',
  '/tmp/data/vertices-0157',
  '/tmp/data/vertices-0158',
  '/tmp/data/vertices-0159',
  '/tmp/data/vertices-0160',
  '/tmp/data/vertices-0161',
  '/tmp/data/vertices-0162',
  '/tmp/data/vertices-0163',
  '/tmp/data/vertices-0164',
  '/tmp/data/vertices-0165',
  '/tmp/data/vertices-0166',
  '/tmp/data/vertices-0167',
  '/tmp/data/vertices-0168',
  '/tmp/data/vertices-0169',
  '/tmp/data/vertices-0170',
  '/tmp/data/vertices-0171',
  '/tmp/data/vertices-0172',
  '/tmp/data/vertices-0173',
  '/tmp/data/vertices-0174',
  '/tmp/data/vertices-0175',
  '/tmp/data/vertices-0176',
  '/tmp/data/vertices-0177',
  '/tmp/data/vertices-0178',
  '/tmp/data/vertices-0179',
  '/tmp/data/vertices-0180',
  '/tmp/data/vertices-0181',
  '/tmp/data/vertices-0182',
  '/tmp/data/vertices-0183',
  '/tmp/data/vertices-0184',
  '/tmp/data/vertices-0185',
  '/tmp/data/vertices-0186',
  '/tmp/data/vertices-0187',
  '/tmp/data/vertices-0188',
  '/tmp/data/vertices-0189',
  '/tmp/data/vertices-0190',
  '/tmp/data/vertices-0191',
  '/tmp/data/vertices-0192',
  '/tmp/data/vertices-0193',
  '/tmp/data/vertices-0194',
  '/tmp/data/vertices-0195',
  '/tmp/data/vertices-0196',
  '/tmp/data/vertices-0197',
  '/tmp/data/vertices-0198',
  '/tmp/data/vertices-0199',
  '/tmp/data/vertices-0200',
  '/tmp/data/vertices-0201',
  '/tmp/data/vertices-0202',
  '/tmp/data/vertices-0203',
  '/tmp/data/vertices-0204',
  '/tmp/data/vertices-0205',
  '/tmp/data/vertices-0206',
  '/tmp/data/vertices-0207',
  '/tmp/data/vertices-0208'
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
