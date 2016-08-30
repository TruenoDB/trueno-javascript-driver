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
  g.setProperty('version', 2);
  g.setProperty('type', 'Biological');
  g.setProperty('snapshot', new Date());
  g.setComputed('pagerank', 'top2', [[1, 4.32], [32, 4.01]]);
  g.setComputed('pagerank', 'average', 15);
  g.setComputed('pagerank', 'low', 5);

  /* persist g */
  g.persist().then((result) => {
    console.log(result);
  }, (error) => {
    console.log(error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})
