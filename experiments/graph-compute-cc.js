/**
 * graph-compute.js
 * This file connects to neo4j and retrieve ConnectedComponents
 * Measures Trueno's Connection time and Job's time
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

if( !(totalArguments==requiredArguments) ) {
  console.log("[usage] node graph-compute-cc.js graph");
}
else {

  const destinationGraph = process.argv[2].toString();

  /* Instantiate connection */
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

    c.setAlgorithm(Enums.algorithmType.CONNECTED_COMPONENTS);
    let parameters = {
      schema: {string: destinationGraph},
      persisted: {string: "false"},
      alpha: {string: "0.85"},
      tolerance: {string: "0.001"},
      persistedTable: {string: "pr11"}
    };
    c.setParameters(parameters);

    /* Get the compute of the algorithm */
    c.deploy().then((jobId) => {
      console.log('JobId: ', jobId);
      console.timeEnd("TruenoConnect");

      let x = setInterval(function () {
        c.jobStatus(jobId).then((status) => {
          console.log('Job Status: ', status);
          if (status == Enums.jobStatus.FINISHED) {
            c.jobResult(jobId).then((result) => {
              console.log('Job Result: ', result);
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
