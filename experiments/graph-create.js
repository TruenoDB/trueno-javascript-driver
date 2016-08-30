/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  console.log('connected', s.id);
  console.log('------------------------Properties, computed, and meta-------------------------------');


  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  /* Adding properties and computed fields */
  g.setProperty('version', 1);

  //Elastic search does not support this
  //g.setComputed('pagerank', 'top2', [[1, 4.32], [32, 4.01]]);
  g.setComputed('pagerank', 'average', 2.55);
  g.setComputed('pagerank', 'low', 1);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g created", result);
  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})
