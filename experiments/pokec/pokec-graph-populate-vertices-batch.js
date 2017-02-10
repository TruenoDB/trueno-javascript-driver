/**
 * Created by: edgardo on 2/9/17.
 * Source: .js
 * Author: edgardo
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const vertices = require('./datasets/soc-pokec-profiles-10.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {


  const batchSize  = 300;

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('pokec');

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
      v.setLabel('profile');
      v.setProperty('public',vertices[vkey].public);
      v.setProperty('completion_percentage',vertices[vkey].completion_percentage);
      v.setProperty('gender',vertices[vkey].gender);
      v.setProperty('region',vertices[vkey].region);
      v.setProperty('last_login',vertices[vkey].last_login);
      v.setProperty('registration',vertices[vkey].registration);
      v.setProperty('age',vertices[vkey].age);

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
