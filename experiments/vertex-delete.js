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

  let v1 = g.addVertex();
  v1.setId(1);

  v1.destroy().then((result) => {
    console.log('Vertex destruction successful: ', result);
  }, (error) => {
    console.log('Vertex destruction failed: ', error);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})