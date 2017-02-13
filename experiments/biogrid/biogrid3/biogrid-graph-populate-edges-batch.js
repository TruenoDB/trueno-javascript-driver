/**
 * biogrid-generate-csv-from-json.js
 * This file generates csvs according to source (json)
 *
 * @version 0.0.1
 * @author  Victor Santos, maverick-zhn(Servio Palacios)
 * @updated 2017.02.13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code. Be nice!
 */

const Trueno = require('../../../lib/trueno');
const edges = require('./biogrid3-edges.json');
const vertices = require('./biogrid3-vertices.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  const batchSize = 300;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('biogrid');

  let eQueue = edges;
  let total = eQueue.length, current = 0;
  console.log(total);

  /* Insertion function */
  function insertEdge(arr) {

    /* persist everything into a batch */
    g.openBatch();

    /* Persist all vertices */
    arr.forEach((edgePair)=> {
      let e = g.addEdge(edgePair.source, edgePair.destination);
      e.setLabel(edgePair.label);
      e.setId(current);
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
