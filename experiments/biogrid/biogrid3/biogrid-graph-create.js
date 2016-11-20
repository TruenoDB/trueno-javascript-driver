/**
 * Created by: victor on 2016.11.01.
 * Source: .js
 * Author: victor, servio
 * Description:
 *
 */

const Trueno = require('../../../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('biogrid_function');

  /* Adding properties and computed fields */
  g.setProperty('description', "biogrid_function");
  g.setProperty('original-nodes', 15035);
  g.setProperty('original-edges', 301686);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g [biogrid_function] created", result);
  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
});
