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

  let e1 = g.addEdge();
  e1.setId(1);

  e1.destroy().then((result) => {
    console.log('Edge destruction successful: ', result);
  }, (error) => {
    console.log('Edge destruction failed: ',error);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})