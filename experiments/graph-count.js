/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: Servio
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

  /* Set label: very important */
  g.setLabel('graphi');

                /* Create a filter */
  let filter = g.filter()
                  .term('prop.name', 'aura');
                  
  g.count('v',filter).then((result) => {
    console.log("Info from Graph g counted", result);
  }, (error) => {
    console.log("Error: Could not count Graph g info", error);
  });

  g.count('v').then((result) => {
    console.log("Total vertices in graph", result);
  }, (error) => {
    console.log("Error: Could not count vertices", error);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})