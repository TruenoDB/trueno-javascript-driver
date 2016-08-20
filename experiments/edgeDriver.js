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

  /* Create a new Graph */
  let g = trueno.Graph();
  let e = g.addEdge(1,2);

  g.setId(1);
  e.setId(1);

  console.log('------------------------Vertices-------------------------------');
  /* Get the out vertices, i.e outgoing neighbors */
  e.vertices().then((vertices)=> {

  });



}, (s)=> {
  console.log('disconnected', s.id);
})