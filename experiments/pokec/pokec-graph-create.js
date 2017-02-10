/**
 * Created by: edgardo on 2/9/17.
 * Source: .js
 * Author: edgardo
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('pokec');

  /* Adding properties and computed fields */
  g.setProperty('description', "pokec");
  g.setProperty('original-nodes', 1632803);
  g.setProperty('original-edges', 30622564);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g [pokec] created", result);
  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
});
