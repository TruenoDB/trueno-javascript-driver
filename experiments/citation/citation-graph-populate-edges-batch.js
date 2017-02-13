/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const edges = require('./citation-edges.json');
const vertices = require('./citation-vertices.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  const batchSize = 300;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('citations');

  let eQueue = edges;
  let total = eQueue.length, current = 0, autoId = 0;

  /* Insertion function */
  function insertEdge(arr) {

    /* persist everything into a batch */
    g.openBatch();

    /* Persist all vertices */
    arr.forEach((edgePair)=> {
      let e = g.addEdge(edgePair[0], edgePair[1]);
      e.setLabel('cited');
      e.setId(autoId++);
      e.persist();
      current++;
    });

    /* insert batch */
    g.closeBatch().then((result) => {
      console.log("Edges batch created.", current / total);
      /* Continue inserting */
      if (eQueue.length) {
        insertEdge(eQueue.splice(0, batchSize));
      } else {
        process.exit();
      }
    }, (error) => {
      console.log("Error: Edges batch creation failed.", error, current / total);
      /* Continue inserting */
      if (eQueue.length) {
        insertEdge(eQueue.splice(0, batchSize));
      } else {
        process.exit();
      }
    });

  }

  /* Initiating vertex insertion */
  insertEdge(eQueue.splice(0, batchSize));

}, (s)=> {
  console.log('disconnected', s.id);
});
