/**
 * Created by: edgardo on 2/9/17.
 * Source: .js
 * Author: edgardo
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');
const dbName = 'movies';
const dbDesc = 'Freebase movies database';

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel(dbName);

  /* Adding properties and computed fields */
  g.setProperty('description', dbDesc);
  g.setProperty('original-nodes', 327642);
  g.setProperty('original-edges', 725788);

  /* persist g */
  g.create().then((result) => {
    console.log(`Graph g [${dbName}] created`, result);
  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
});
