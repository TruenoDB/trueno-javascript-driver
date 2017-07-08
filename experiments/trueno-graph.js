"use strict";

/**
 * trueno-graph.js
 * This file send requests for graph creation
 *
 * @version 0.0.0.1
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * @editor  maverick-zhn(Servio Palacios)
 * @updated 2017.07.08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code.
 */

/* import modules */
const Promise = require("bluebird");
const Socket = require("uws");
let ipAddress = require("ip-address").Address4;

let requiredArguments = 4;
let totalArguments = process.argv.length;

let defaultPort = "8007";
let defaultHost = "127.0.0.1";
let strHost = defaultHost;
let strPort = defaultPort;

if( !(totalArguments >= requiredArguments) ) {
  console.log("[usage] node trueno-graph.js action graph [host] [port]");
  process.exit(0);
}

let strAction        = process.argv[2].toString();
let destinationGraph = process.argv[3].toString();

if( totalArguments >= requiredArguments + 1){
  let tmpAddress = new ipAddress(process.argv[4].toString());
  /* If IP address is valid override default address */
  if(tmpAddress.isValid()){
    strHost = process.argv[4].toString();
  }
  else{
    console.log("[Warning] --> Invalid IP address, default [127.0.0.1] used instead");
  }
}

if( totalArguments == requiredArguments + 2){
    strPort = process.argv[5].toString();
}

/* Trueno's WebSockets connection */
let ws = new Socket("ws://" + strHost + ":" + strPort);

/* Create callbacks reference */
let callbacks = {};

/* When open connection */
ws.on("open", function open() {
  console.log("[Connected] --> Host[" + strHost + "] Port [" + strPort + "]");
  create();
});

/* When error */
ws.on("error", function error() {
  console.log("[Error] --> On connection, verify [host] and [port]");
});

/* When message received */
ws.on("message", function(data, flags) {
  let obj = JSON.parse(data);
  callbacks[obj.callbackIndex](obj);

  if(obj.callbackIndex == counter) {
    console.log("[Request] --> [" + strAction + "] [" + destinationGraph + "] completed");
    process.exit(0);
  }
});

/* When connection is closed */
ws.on("close", function(code, message) {
  console.log("Disconnection: " + code + ", " + message);
});

/* the payload object */
let internal = {
  index: destinationGraph
};

let counter = "create_1";

/* Request's payload */
let payload = {
  callbackIndex: counter,
  action: strAction,
  object: internal
};

/* Sending request */
function create() {
  console.log("[Request] --> [" + strAction + "] [" + destinationGraph + "] sent");
  ws.send(JSON.stringify(payload));
  /* adding callback */
  callbacks[counter] = function(results){

  };
}
