/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000});

trueno.connect((s)=> {

  console.log('connected', s.id);

  /* Create a new Graph */
  let g = trueno.Graph();
  let v = g.addVertex();

  v.load(1).then((v) => {

    console.log(v.getId()); /* display the vertex ID */
    /* display property */
    console.log(v.getProperty('age')); /* display age in console */
    v.setProperty('name', 'John');

    return g.persist('v');

  }).then((result) => {

    /* Persist vertex */
    console.log(result);

  });

  /* Get the out vertices, i.e outgoing neighbors */
  v.out('v').then((vertices)=>{

  });

  /* Get the out edges, i.e outgoing edges */
  v.out('e').then((edges)=>{

  });

  /* Get the in vertices, i.e  incoming neighbors */
  v.in('v').then((vertices)=>{

  });

  /* Get the in edges, i.e  incoming edges */
  v.in('e').then((edges)=>{

  });

  /* Get with filter */
  let filter =  v.filter()
  .range('prop.weight','gt',8)
  .range('prop.weight','lt',22)
  .limit(20);

  v.in('e',filter).then((edges)=>{

  });

  /* Get the in vertices, i.e  incoming neighbors */
  v.inDegree('v').then((count)=>{

  });

  /* Get the out edges, i.e outgoing edges */
  v.outDegree('e', filter).then((count)=>{

  });


}, (s)=> {
  console.log('disconnected', s.id);
})