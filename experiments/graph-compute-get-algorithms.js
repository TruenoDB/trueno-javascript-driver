/**
 * Created by: Servio on 2016.09.17.
 * Source: .js
 * Author: Servio Palacios
 * Description:
 *
 */

const Trueno = require('../lib/trueno');
const Enums = require("../lib/core/data_structures/enums");

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  console.log('connected', s.id);

  /* Create a new Graph */
  let g = trueno.Graph();
  g.setId(1);
  g.setLabel("graphii");

  console.log('-------------------- Get Compute Algorithms ---------------------------');
  let c = g.getCompute();

  /* Get the compute of the algorithm */
  c.getAlgorithms().then((algorithms)=> {
    console.log('Algorithms: ', algorithms);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})