/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'localhost', port: 8000, debug: true});

trueno.connect((s)=> {

  console.log('connected', s.id);
  console.log('------------------------Properties, computed, and meta-------------------------------');


  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  let e1 = g.addEdge();
  e1.setId(1);

  /* persist v1 */
  e1.vertices().then((vertices) => {
    console.log('Edge vertices are: ', vertices);
  }, (error) => {
    console.log('Error fetching vertices: ',error);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})