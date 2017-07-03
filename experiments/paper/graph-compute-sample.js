
/* Including Libraries */
const Trueno = require('../lib/trueno');
const Enums = require("../enums");

let trueno = new Trueno({ host: host, port: port});

trueno.connect((s) => {

  /* Create a new Graph */
  let g = trueno.Graph();

  g.setLabel(destinationGraph);

  let computeObject = g.getCompute();

  computeObject.setAlgorithm(Enums.algorithmType.PAGE_RANK);

  let parameters = {
    schema: {string: destinationGraph},
    tolerance: {string: 0.000000001},
    alpha: {string: 0.85},
    persisted: {string: "false"},
    persistedTable: {string: "vertices"}
  };

  computeObject.setParameters(parameters);

  /* Get the JobId of the algorithm */
  computeObject.deploy().then((jobId) => {

    console.log('JobId: ', jobId);
    computeObject.jobStatus(jobId)
      .then((status) => {

        if (status == Enums.jobStatus.FINISHED) {
          computeObject.jobResult(jobId)
                       .then((ranks) => {
            console.log('Ranks: ', ranks.result);
          });
        }
      });
  });

}, (s) => {
  console.log('disconnected', s.id);
});


