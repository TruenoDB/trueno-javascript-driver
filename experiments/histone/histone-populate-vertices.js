/**
 * Created by: Servio Palacios on 2017.07.28.
 * Source: .js
 * Author: Servio Palacios
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const vertices = require('./datasets/histone-vertices-source.json');

/* connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  const batchSize  = 200;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: this is the name of the graph/index */
  g.setLabel("histone");

  let vQueue = Object.keys(vertices);
  let total = vQueue.length, current = 0;

  /* Insertion function */
  function insertVertex(arr) {

    /* persist everything into a batch */
    g.openBatch();

    /* Persist all vertices */
    arr.forEach((vkey)=> {

      /* adding vertex object in graph */
      let v = g.addVertex();

      /* setting vertex id */
      v.setId(parseInt(vertices[vkey].id));

      /* name */
      v.setProperty('name',vertices[vkey].name);

      /* label */
      v.setLabel(vertices[vkey].label);

      /* labelnum */
      v.setProperty('labelnum', vertices[vkey].labelnum);

      /* persist in batch */
      v.persist();
      current++;
    });

    // /* insert batch */
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

