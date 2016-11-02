/**
 * Created by: victor on 2016.11.01.
 * Source: .js
 * Author: victor, servio
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const vertices = require('./biogrid-vertices.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {


  const batchSize  = 300;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('biogrid');

  let vQueue = Object.keys(vertices);
  let total = vQueue.length, current = 0;

  /* Insertion function */
  function insertVertex(arr) {

    /* persist everything into a batch */
    g.openBatch();

    /* Persist all vertices */
    arr.forEach((vkey)=> {
      let v = g.addVertex();
      v.setId(parseInt(vkey));
      //v.setLabel('paper');
      v.setLabel(vertices[vkey].label);
      /* persist in batch */
      v.persist();
      current++;
    });

    /* insert batch */
    g.closeBatch().then((result) => {
      console.log("Vertices batch created.", current / total);
      /* Continue inserting */
      if (vQueue.length) {
        insertVertex(vQueue.splice(0, batchSize));
      }else{
        process.exit();
      }
    }, (error) => {
      console.log("Error: Vertices batch creation failed.", error, current / total);
      /* Continue inserting */
      if (vQueue.length) {
        insertVertex(vQueue.splice(0, batchSize));
      }else{
        process.exit();
      }
    });
  }

  /* Initiating vertex insertion */
  insertVertex(vQueue.splice(0, batchSize));

}, (s)=> {
  console.log('disconnected', s.id);
});
