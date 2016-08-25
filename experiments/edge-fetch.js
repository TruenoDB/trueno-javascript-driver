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
  
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  let e1 = g.addEdge();
  e1.setId(1);

  /* Create a filter */
  let filter = e1.filter()
                  .term('prop.relation', 'hate');

  e1.fetch('e',filter).then((result) => {
    console.log('Edge fetch successful: ', result);
  }, (error) => {
    console.log('Edge fetch failed: ', error);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})