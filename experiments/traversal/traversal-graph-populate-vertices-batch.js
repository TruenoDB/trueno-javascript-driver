/**
 * Created by: edgardo on 2/9/17.
 * Source: .js
 * Author: edgardo
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const dbName = 'traversal';
const vertices = require('./data/vertices.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {


  const batchSize  = 300;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel(dbName);

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

      for (let prop in vertices[vkey]) {
        if (prop == "label") {
          v.setLabel(vertices[vkey][prop]);
        } else {
          v.setProperty(prop, vertices[vkey][prop]);
        }
      }

      /* persist in batch */
      v.persist();
      current++;
    });

    /* insert batch */
    console.time("time");
    g.closeBatch().then((result) => {
      console.log("Vertices batch created.", current / total);
      /* Continue inserting */
      if (vQueue.length) {
        insertVertex(vQueue.splice(0, batchSize));
      }else{
        console.timeEnd("time");
        process.exit();
      }
    }, (error) => {
      console.log("Error: Vertices batch creation failed.", error, current / total);
      /* Continue inserting */
      if (vQueue.length) {
        insertVertex(vQueue.splice(0, batchSize));
      }else{
        console.timeEnd("time");
        process.exit();
      }
    });
  }

  /* Initiating vertex insertion */
  insertVertex(vQueue.splice(0, batchSize));

}, (s)=> {
  console.log('disconnected', s.id);
});
