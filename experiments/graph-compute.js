/**
 * Created by: Servio on 2016.09.17.
 * Source: .js
 * Author: Servio
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
  g.setLabel("graphi");


  console.log('------------------------Compute-------------------------------');
  let c = g.getCompute();

  c.setAlgorithm(Enums.algorithmType.PAGE_RANK);
  let parameters = {
      schema:   {string: "citations"},
      vertices: {string: "vertices"},
      edges:    {string: "edges"},
      vertexId: {string: "id"},
      source:   {string: "source"},
      target:   {string: "target"},
      TOL:      {string: 0.001},
      alpha:    {string: 0.85}
  };
  c.setParameters(parameters);

  /* Get the compute of the algorithm */
  c.deploy().then((jobId)=> {
    console.log('JobId: ', jobId);

     var x = setInterval(function () {
       c.jobStatus(jobId).then((status)=> {
          console.log('Job Status: ', status);
          if (status == "FINISHED") {
             c.jobResult(jobId).then((result)=> {
               console.log('Job Result: ', result);
               clearInterval(x);
             });
          }
       });
    }, 5000);

  });

}, (s)=> {
  console.log('disconnected', s.id);
})