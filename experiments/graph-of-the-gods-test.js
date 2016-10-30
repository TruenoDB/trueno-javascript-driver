"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */
// let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});
let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  /* Create a new Graph */
  let g = trueno.Graph();
  g.setLabel("titan");
  g.open().then( (result) => {

    /* vertices */
    let jupiter = g.addVertex();
    jupiter.setId(4);

      /* Create a filter */
  let filter = g.filter()
            .range('prop.age', 'lt', 4001)

    let filter2 = g.filter()
    .term('label', 'brother');

    jupiter.in('v', filter, filter2).then((result) => {
      console.log('vertices in  <-- ', result);
    });

    // jupiter.out('v').then((result) => {
    //   console.log('vertices out --> ', result)
    // });

    // jupiter.in('e').then((result) => {
    //   console.log('edges in    <-- ', result);
    // });

    // jupiter.out('e').then((result) => {
    //   console.log('edges out    --> ', result)
    // });

  });

}, (s)=> {
  console.log('disconnected', s.id);
});

