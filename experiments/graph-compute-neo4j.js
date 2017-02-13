/**
 * graph-compute-neo4j.js
 * This file connects to neo4j and retrieve pakeranks
 *
 * @version 0.0.1
 * @author  Victor, Servio
 * @updated 2017.02.13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code. Be nice!
 */

let neo4j = require('neo4j-driver').v1;

// Create a driver instance, for the user neo4j with password neo4j.
// It should be enough to have a single driver per database per application.
//var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neoj4"));
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "01010011"));

// Register a callback to know if driver creation was successful:
driver.onCompleted = function() {
  // proceed with using the driver, it was successfully instantiated
  console.log('Driver instantiation success');
};

// Register a callback to know if driver creation failed.
// This could happen due to wrong credentials or database unavailability:
driver.onError = function(error) {
  console.log('Driver instantiation failed', error);
};

// Create a session to run Cypher statements in.
// Note: Always make sure to close sessions when you are done using them!
let session = driver.session();

//let query = "MATCH p=()-[r:INTERACTION]->() RETURN p LIMIT 25";
let pageRankQuery = "MATCH (a)-[:FOLLOWS]-() RETURN DISTINCT id(a) as id, a.pagerank as pagerank ORDER BY pagerank DESC";
let param = {id:1};

// Run a Cypher statement, reading the result in a streaming manner as records arrive:
session
  .run(pageRankQuery, param)
  .then(function(result){
    console.log(result);
    // Completed!
    session.close();
  })
  .catch(function(error) {
    console.log(error);
  });
