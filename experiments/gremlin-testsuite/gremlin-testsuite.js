"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * Create data structure needed for gremlin test suite.
 * @module experiment/gremlin-testsuite
 */



const Trueno = require('../../lib/trueno');
const testcases = require('./testcases-graphs.json');

/* Instantiate connection */
let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  /* Create a new Graph */
  let g = trueno.Graph();
  /* input */
  let eQueue = Object.keys(testcases);

  /* create tables */
  function createGraphs(name) {
    /* Set label: very important */
    g.setLabel(name);
    /* Create (persist) graph on backend store */
    g.create().then((result) => {
      console.log("good graph: [" + name + "]");
      /* Continue inserting */
      if (eQueue.length) {
        createGraphs(eQueue.shift());
      }
    }, (error) => {
      console.log("bad  graph: [" + name + "]");
      /* Continue inserting */
      if (eQueue.length) {
        createGraphs(eQueue.shift());
      }else{
        process.exit();
      }
    });
  }

  createGraphs(eQueue.shift());

}, (s)=> {
  console.log('disconnected', s.id);
});

