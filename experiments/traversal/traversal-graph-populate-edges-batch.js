/**
 * Created by: edgardo on 2/9/17.
 * Source: .js
 * Author: edgardo
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const dbName = 'traversal';
const edges = require('./data/edges.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  const batchSize = 300;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel(dbName);

  let eQueue = Object.keys(edges);
  let total = eQueue.length, current = 0;
  console.log(total);

  /* Insertion function */
  function insertEdge(arr) {

    /* persist everything into a batch */
    g.openBatch();

    /* Persist all vertices */
    arr.forEach((ekey)=> {
      let edgePair = edges[ekey];
      let e = g.addEdge(edgePair.source, edgePair.destination);
      e.setLabel(edgePair.label);
      e.setId(current);
      e.persist();
      current++;
    });

    /* insert batch */
    console.time("time");
    g.closeBatch().then((result) => {
      console.log("Edges batch created.", current / total);
      /* Continue inserting */
      if (eQueue.length) {
        insertEdge(eQueue.splice(0, batchSize));
      } else {
        console.timeEnd("time");
        process.exit();
      }
    }, (error) => {
      console.log("Error: Edges batch creation failed.", error, current / total);
      /* Continue inserting */
      if (eQueue.length) {
        insertEdge(eQueue.splice(0, batchSize));
      } else {
        console.timeEnd("time");
        process.exit();
      }
    });

  }

  /* Initiating vertex insertion */
  insertEdge(eQueue.splice(0, batchSize));

}, (s)=> {
  console.log('disconnected', s.id);
});
