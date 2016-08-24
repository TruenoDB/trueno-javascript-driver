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

  /* Set label: very important */
  g.setLabel('graphi');

  let filter = g.filter()
                .term('prop.version', '1');

                /* Create a filter */
  let filter2 = g.filter()
                  .term('prop.name', 'pedro');
                  

  /* persist g */
  g.fetch('g',filter).then((result) => {
    console.log("Info from Graph g fetched", result);
  }, (error) => {
    console.log("Error: Could not fetch Graph g info", error);
  });

  g.fetch('v',filter2).then((result) => {
    console.log("Info from Graph g fetched", result);
  }, (error) => {
    console.log("Error: Could not fetch Graph g info", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})