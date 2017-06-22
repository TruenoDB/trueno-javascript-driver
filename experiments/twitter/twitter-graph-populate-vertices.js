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
  '/tmp/datavertices-0000',
  '/tmp/datavertices-0001',
  '/tmp/datavertices-0002',
  '/tmp/datavertices-0003',
  '/tmp/datavertices-0004',
  '/tmp/datavertices-0005',
  '/tmp/datavertices-0006',
  '/tmp/datavertices-0007',
  '/tmp/datavertices-0008',
  '/tmp/datavertices-0009',
  '/tmp/datavertices-0010',
  '/tmp/datavertices-0011',
  '/tmp/datavertices-0012',
  '/tmp/datavertices-0013',
  '/tmp/datavertices-0014',
  '/tmp/datavertices-0015',
  '/tmp/datavertices-0016',
  '/tmp/datavertices-0017',
  '/tmp/datavertices-0018',
  '/tmp/datavertices-0019',
  '/tmp/datavertices-0020',
  '/tmp/datavertices-0021',
  '/tmp/datavertices-0022',
  '/tmp/datavertices-0023',
  '/tmp/datavertices-0024',
  '/tmp/datavertices-0025',
  '/tmp/datavertices-0026',
  '/tmp/datavertices-0027',
  '/tmp/datavertices-0028',
  '/tmp/datavertices-0029',
  '/tmp/datavertices-0030',
  '/tmp/datavertices-0031',
  '/tmp/datavertices-0032',
  '/tmp/datavertices-0033',
  '/tmp/datavertices-0034',
  '/tmp/datavertices-0035',
  '/tmp/datavertices-0036',
  '/tmp/datavertices-0037',
  '/tmp/datavertices-0038',
  '/tmp/datavertices-0039',
  '/tmp/datavertices-0040',
  '/tmp/datavertices-0041',
  '/tmp/datavertices-0042',
  '/tmp/datavertices-0043',
  '/tmp/datavertices-0044',
  '/tmp/datavertices-0045',
  '/tmp/datavertices-0046',
  '/tmp/datavertices-0047',
  '/tmp/datavertices-0048',
  '/tmp/datavertices-0049',
  '/tmp/datavertices-0050',
  '/tmp/datavertices-0051',
  '/tmp/datavertices-0052',
  '/tmp/datavertices-0053',
  '/tmp/datavertices-0054',
  '/tmp/datavertices-0055',
  '/tmp/datavertices-0056',
  '/tmp/datavertices-0057',
  '/tmp/datavertices-0058',
  '/tmp/datavertices-0059',
  '/tmp/datavertices-0060',
  '/tmp/datavertices-0061',
  '/tmp/datavertices-0062',
  '/tmp/datavertices-0063',
  '/tmp/datavertices-0064',
  '/tmp/datavertices-0065',
  '/tmp/datavertices-0066',
  '/tmp/datavertices-0067',
  '/tmp/datavertices-0068',
  '/tmp/datavertices-0069',
  '/tmp/datavertices-0070',
  '/tmp/datavertices-0071',
  '/tmp/datavertices-0072',
  '/tmp/datavertices-0073',
  '/tmp/datavertices-0074',
  '/tmp/datavertices-0075',
  '/tmp/datavertices-0076',
  '/tmp/datavertices-0077',
  '/tmp/datavertices-0078',
  '/tmp/datavertices-0079',
  '/tmp/datavertices-0080',
  '/tmp/datavertices-0081',
  '/tmp/datavertices-0082',
  '/tmp/datavertices-0083',
  '/tmp/datavertices-0084',
  '/tmp/datavertices-0085',
  '/tmp/datavertices-0086',
  '/tmp/datavertices-0087',
  '/tmp/datavertices-0088',
  '/tmp/datavertices-0089',
  '/tmp/datavertices-0090',
  '/tmp/datavertices-0091',
  '/tmp/datavertices-0092',
  '/tmp/datavertices-0093',
  '/tmp/datavertices-0094',
  '/tmp/datavertices-0095',
  '/tmp/datavertices-0096',
  '/tmp/datavertices-0097',
  '/tmp/datavertices-0098',
  '/tmp/datavertices-0099',
  '/tmp/datavertices-0100',
  '/tmp/datavertices-0101',
  '/tmp/datavertices-0102',
  '/tmp/datavertices-0103',
  '/tmp/datavertices-0104',
  '/tmp/datavertices-0105',
  '/tmp/datavertices-0106',
  '/tmp/datavertices-0107',
  '/tmp/datavertices-0108',
  '/tmp/datavertices-0109',
  '/tmp/datavertices-0110',
  '/tmp/datavertices-0111',
  '/tmp/datavertices-0112',
  '/tmp/datavertices-0113',
  '/tmp/datavertices-0114',
  '/tmp/datavertices-0115',
  '/tmp/datavertices-0116',
  '/tmp/datavertices-0117',
  '/tmp/datavertices-0118',
  '/tmp/datavertices-0119',
  '/tmp/datavertices-0120',
  '/tmp/datavertices-0121',
  '/tmp/datavertices-0122',
  '/tmp/datavertices-0123',
  '/tmp/datavertices-0124',
  '/tmp/datavertices-0125',
  '/tmp/datavertices-0126',
  '/tmp/datavertices-0127',
  '/tmp/datavertices-0128',
  '/tmp/datavertices-0129',
  '/tmp/datavertices-0130',
  '/tmp/datavertices-0131',
  '/tmp/datavertices-0132',
  '/tmp/datavertices-0133',
  '/tmp/datavertices-0134',
  '/tmp/datavertices-0135',
  '/tmp/datavertices-0136',
  '/tmp/datavertices-0137',
  '/tmp/datavertices-0138',
  '/tmp/datavertices-0139',
  '/tmp/datavertices-0140',
  '/tmp/datavertices-0141',
  '/tmp/datavertices-0142',
  '/tmp/datavertices-0143',
  '/tmp/datavertices-0144',
  '/tmp/datavertices-0145',
  '/tmp/datavertices-0146',
  '/tmp/datavertices-0147',
  '/tmp/datavertices-0148',
  '/tmp/datavertices-0149',
  '/tmp/datavertices-0150',
  '/tmp/datavertices-0151',
  '/tmp/datavertices-0152',
  '/tmp/datavertices-0153',
  '/tmp/datavertices-0154',
  '/tmp/datavertices-0155',
  '/tmp/datavertices-0156',
  '/tmp/datavertices-0157',
  '/tmp/datavertices-0158',
  '/tmp/datavertices-0159',
  '/tmp/datavertices-0160',
  '/tmp/datavertices-0161',
  '/tmp/datavertices-0162',
  '/tmp/datavertices-0163',
  '/tmp/datavertices-0164',
  '/tmp/datavertices-0165',
  '/tmp/datavertices-0166',
  '/tmp/datavertices-0167',
  '/tmp/datavertices-0168',
  '/tmp/datavertices-0169',
  '/tmp/datavertices-0170',
  '/tmp/datavertices-0171',
  '/tmp/datavertices-0172',
  '/tmp/datavertices-0173',
  '/tmp/datavertices-0174',
  '/tmp/datavertices-0175',
  '/tmp/datavertices-0176',
  '/tmp/datavertices-0177',
  '/tmp/datavertices-0178',
  '/tmp/datavertices-0179',
  '/tmp/datavertices-0180',
  '/tmp/datavertices-0181',
  '/tmp/datavertices-0182',
  '/tmp/datavertices-0183',
  '/tmp/datavertices-0184',
  '/tmp/datavertices-0185',
  '/tmp/datavertices-0186',
  '/tmp/datavertices-0187',
  '/tmp/datavertices-0188',
  '/tmp/datavertices-0189',
  '/tmp/datavertices-0190',
  '/tmp/datavertices-0191',
  '/tmp/datavertices-0192',
  '/tmp/datavertices-0193',
  '/tmp/datavertices-0194',
  '/tmp/datavertices-0195',
  '/tmp/datavertices-0196',
  '/tmp/datavertices-0197',
  '/tmp/datavertices-0198',
  '/tmp/datavertices-0199',
  '/tmp/datavertices-0200',
  '/tmp/datavertices-0201',
  '/tmp/datavertices-0202',
  '/tmp/datavertices-0203',
  '/tmp/datavertices-0204',
  '/tmp/datavertices-0205',
  '/tmp/datavertices-0206',
  '/tmp/datavertices-0207',
  '/tmp/datavertices-0208'
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
