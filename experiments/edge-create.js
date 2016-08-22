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

  let e1 = g.addEdge(1,2);
  let e2 = g.addEdge(2,3);

  /* Adding properties and computed fields */
  e1.setProperty('weight', 35);
  e1.setProperty('relation', 'love');
  e1.setProperty('weight', 45);
  e1.setProperty('relation', 'hate');
  e2.setComputed('pagerank', 'rank', 5);

  /* persist v1 */
  e1.persist().then((result) => {
    console.log('Edge successfully created with id: ', e1.getId());
  }, (error) => {
    console.log('Edge persistence error: ',error);
  });
  /* persist v2 */
  e2.persist().then((result) => {
    console.log('Edge successfully created with id: ', e2.getId());
  }, (error) => {
    console.log('Edge persistence error: ',error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})