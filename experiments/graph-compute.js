/**
 * graph-compute.js
 * This file connects to neo4j and retrieve pakeranks
 *
 * @version 0.0.1
 * @author   maverick-zhn(Servio Palacios)
 * @updated 2017.02.13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code. Be nice!
 */

const Trueno = require('../lib/trueno');
const Enums = require("../lib/core/data_structures/enums");

let requiredArguments = 3;
let totalArguments = process.argv.length;

/* Instantiate connection */

if( !(totalArguments==requiredArguments) ) {
  console.log("[usage] node graph-compute.js graph");
}
else {

  const destinationGraph = process.argv[2].toString();

  let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

  console.time("TruenoConnect");
  trueno.connect((s) => {

    console.log('connected', s.id);

    /* Create a new Graph */
    let g = trueno.Graph();
    g.setId(1);
    g.setLabel(destinationGraph);

    console.log('------------------------Compute-------------------------------');
    let c = g.getCompute();

    c.setAlgorithm(Enums.algorithmType.PAGE_RANK);
    let parameters = {
      schema: {string: destinationGraph},
      tolerance: {string: 0.001},
      alpha: {string: 0.85},
      persisted: {string: "false"},
      persistedTable: {string: "vertices"}
    };
    c.setParameters(parameters);

    /* Get the compute of the algorithm */
    c.deploy().then((jobId) => {

      console.timeEnd("TruenoConnect");

      console.log('JobId: ', jobId);

      let x = setInterval(function () {
        c.jobStatus(jobId).then((status) => {
          console.log('Job Status: ', status);
          if (status == Enums.jobStatus.FINISHED) {
            c.jobResult(jobId).then((result) => {
              console.log('Job Result: ', result);
              // var ranks = result.result;
              // ranks.sort(function(a, b){return b[1]-a[1]});
              // ranks.slice(1,10);
              // console.log(ranks.slice(1,10));
              clearInterval(x);
            });
          }
        });
      }, 5000);

    });

  }, (s) => {
    console.log('disconnected', s.id);
  });

}
