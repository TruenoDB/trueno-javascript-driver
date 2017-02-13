/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor, servio
 * Description:
 *
 */

const Trueno = require('../../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {



  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('citations');

  /* Adding properties and computed fields */
  g.setProperty('description', "Arxiv HEP-TH (high energy physics theory) citation graph is from the e-print arXiv and covers all the citations within a dataset of 27,770 papers with 352,807 edges");
  g.setProperty('original-nodes', 27770);
  g.setProperty('original-edges', 352807);

  /* Add computed fields */
  g.setComputed('average-clustering-coefficient', 'coefficient', 0.3120);
  g.setComputed('num-of-triangles', 'value', 1478735);
  g.setComputed('fraction-of-closed-triangles', 'value', 1478735);
  g.setComputed('diameter', 'value', 13);
  g.setComputed('90-percentile-efective-diameter', 'value', 5.3);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g created", result);
  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})
