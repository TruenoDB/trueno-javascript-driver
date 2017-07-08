"use strict";

/**
 * bulk-test.js
 * This file generates bulk requests to the ES socket server
 *
 * @version 0.0.0.1
 * @author  maverick-zhn(Servio Palacios)
 * @updated 2017.07.08
 *
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code.
 */

/* import modules */
let ProgressBar = require("progress");
const Promise   = require("bluebird");
let Socket      = require("uws");
const fs        = require("fs");
let ipAddress   = require("ip-address").Address4;

let callbacks = {};

/* variables to keep track of batches and progress */
let limit = 10000000;
let counter = 0;

/* keeps the current batch to be sent */
let bulkOperations = [];

/* Elastic Search Index to be used */
let indexName = "ldbc_";
const typeName = "e";
let defaultPort = "8007";
let defaultHost = "127.0.0.1";
let strHost = defaultHost;
let strPort = defaultPort;
let strDefaultRelationship = "knows";
let strRelationship = strDefaultRelationship;

let requiredArguments = 4;
let totalArguments = process.argv.length;

if( !(totalArguments>=requiredArguments) ) {
  console.log("[usage] node graph-populate-edges.js graph relationship [host] [port]");
  process.exit(0)
}

/* Setting destination Graph/Index */
const destinationGraph = process.argv[2].toString();
/* Setting Relationship type on edges (default is "knows") */
strRelationship = process.argv[3].toString();

indexName += destinationGraph;

/* validating IP address */
if( totalArguments >= requiredArguments + 1){
  let tmpAddress = new ipAddress(process.argv[4].toString());
  /* If IP address is valid override default address */
  if(tmpAddress.isValid()){
    strHost = process.argv[4].toString();
  }
  else{
    console.log("[Warning] --> Invalid IP address, default (127.0.0.1) used instead");
  }
}

/* if PORT provided */
if( totalArguments == requiredArguments + 2){
  strPort = process.argv[5].toString();
}

/* Trueno's WebSockets connection */
let ws = new Socket("ws://" + strHost + ":" + strPort);

/* source datasets/documents [download datasets from java-script-driver] */
const edges = require("./datasets/" + destinationGraph + "/" + destinationGraph + "-edges.json");

/* amount of records per request */
const batchSize  = 500;

/* set this variable to vertices if you want that kind of documents */
// let vQueue = Object.keys(vertices);

/* set this variable to edges if you want that kind of documents */
let vQueue = Object.keys(edges);

let eQueue = edges;

let total = vQueue.length, current = 0;

console.log("total edges [" + total + "]");

/* Set this variables to delete or insert */
let strRequest = "persist";
//var strRequest = "destroy";

/* Showing request progress bar */
let previous = 0;
let bar = new ProgressBar("ElasticSearch Bulk Request [:bar] :percent :elapsed", {
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
 *  insert/delete vertices/edges in batch function
 *  @param {string} op - The operation to be inserted into the bulk list.
 *
 */
function insertDeleteVertices(arr,op) {

  /* Persist all edges */
  arr.forEach((edgePair)=> {
    let e = {};
    e.id = null;
    e._label = null;
    e._prop = {};

    e.id = current;

    e.source = edgePair.source;
    e.target = edgePair.destination;
    e._label = strRelationship;

    /* building the message */
    let payload = {
      graph: indexName,
      type: typeName,
      obj: e
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
    let currentTick = Math.floor(current/total*100);
    if(currentTick>previous){
      previous = currentTick;
      bar.tick();
    }

    /* Continue inserting */
    if (eQueue.length) {
      insertDeleteVertices(eQueue.splice(0, batchSize),op);
    }else{
      console.timeEnd("time");
      process.exit();
    }

  }, (error) => {

    console.log("Error: Vertices batch creation failed.", error, current / total);
    /* Continue inserting */
    if (eQueue.length) {
      insertDeleteVertices(eQueue.splice(0, batchSize),op);
    } else {
      process.exit();
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
  let arrOperations = [];

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
 * @return {Promise} - Promise with the bulk operations results.
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
function buildVerticesFromJSON(){
  /* Initiating vertex insertion */
  insertDeleteVertices(eQueue.splice(0, batchSize),strRequest);
}

ws.on("open", function open() {
  console.log("[Connected] --> Host[" + strHost + "] Port [" + strPort + "]");
  console.time("time");

  /* start bulk read and request to socket server */
  buildVerticesFromJSON();
});

ws.on("error", function error() {
  console.log("[Error] --> On connection, verify [host] and [port]");
});

ws.on("message", function(data, flags) {
  let obj = JSON.parse(data);
  //console.log(obj);
  /* invoke the callback */
  callbacks[obj.callbackIndex]();
});

ws.on("close", function(code, message) {
  console.log('Disconnection: ' + code + ', ' + message);
});

