/**
 * Created by: Servio on 2016.11.01.
 * Source: .js
 * Author: victor, servio
 * Description:
 */

const Trueno = require('../../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('erdos_renyi');


  /* Adding properties and computed fields */
  g.setProperty('description', "erdos_renyi");
  // g.setProperty('original-nodes', 59651);
  // g.setProperty('original-edges', 1028383);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g [erdos_renyi] created", result);
  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
});
