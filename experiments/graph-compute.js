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

  let c = g.getCompute(Enums.algorithmType.DEPENDENCIES);

  console.log('------------------------Compute-------------------------------');

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
    }, 10000);

  });

}, (s)=> {
  console.log('disconnected', s.id);
})