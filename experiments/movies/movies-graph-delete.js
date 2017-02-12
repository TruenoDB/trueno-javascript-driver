/**
 * Created by: edgardo on 2/9/17.
 * Source: .js
 * Author: edgardo
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const dbName = 'movies';

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {



  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel(dbName);

  /* persist g */
  g.destroy().then((result) => {
    console.log(`Graph g [${dbName}] destroyed`, result);
  }, (error) => {
    console.log("Error: Graph g destruction failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})
