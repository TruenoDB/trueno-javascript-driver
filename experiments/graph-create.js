/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: true});

trueno.connect((s)=> {

  console.log('connected', s.id);
  console.log('------------------------Properties, computed, and meta-------------------------------');


  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  /* Adding properties and computed fields */
  g.setProperty('version', 1);
  g.setComputed('pagerank', 'top2', [[1, 4.32], [32, 4.01]]);
  g.setComputed('pagerank', 'average', 2.55);

  /* persist g */
  g.persist().then((result) => {
    console.log("Graph g persisted", result);
  }, (error) => {
    console.log("Error: Graph g persistence failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})