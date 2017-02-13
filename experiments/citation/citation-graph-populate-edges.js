/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');
const edges = require('./citation-edges.json');
const vertices = require('./citation-vertices.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {



  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('citations');

  let eQueue = edges;
  let total = eQueue.length, current = 0, autoId = 0;

  /* Insertion function */
  function insertEdge(edgePair) {
      let e = g.addEdge(edgePair[0], edgePair[1]);
      e.setLabel('cited');
      e.persist(autoId++);
      e.persist().then((result) => {
        console.log("Edge " + edgePair[0] + " -> ", edgePair[1] + " created. ", (current++) / total);
        /* Continue inserting */
        if (eQueue.length) {
          insertEdge(eQueue.shift());
        }
      }, (error) => {
        console.log("Error " + edgePair[0] + " -> ", edgePair[1] + " cannot be created. ", error, (current++) / total);
        /* Continue inserting */
        if (eQueue.length) {
          insertEdge(eQueue.shift());
        }else{
          process.exit();
        }
      });
  }

  /* Initiating vertex insertion */
  insertEdge(eQueue.shift());

}, (s)=> {
  console.log('disconnected', s.id);
});
