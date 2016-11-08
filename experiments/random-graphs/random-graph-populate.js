/**
 * Created by: Servio on 2016.11.01.
 * Source: .js
 * Author: victor, servio
 * Description:
 */

const Trueno = require('../../lib/trueno');
const RandomGraph = require('random-graph');

/* Instantiate connection */
let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {
  /* Create a new Graph */
  let g = trueno.Graph();
  let length = 50;
  let p = 0.5;
  let objRandomGraph = new RandomGraph({debug: this.__debug, graph: this});
  let generatedGraph = objRandomGraph.generateErdosRenyi(length,p);

  /* Set label: very important */
  g.setLabel('erdos_renyi');

  /* Adding properties and computed fields */
  g.setProperty('description', "erdos_renyi");
  g.setProperty('original-nodes', length);
  g.setProperty('original-edges', generatedGraph.edges.length);
  //console.log(generatedGraph);

  let total = length;
  let current = 1;
  let vertices = generatedGraph.nodes;

  for (i = 0; i < length; i++) {
    let v = g.addVertex();
    let vertex = vertices[i];
    v.setId(parseInt(vertex.id));
    v.setLabel(vertex.id);
    v.persist().then((result) => {
      console.log("Vertex " + vertex + " created. ", (current++) / total);
    }, (error) => {
      console.log("Error: Vertex " + vertex + " creation failed", error, (current++) / total);
    });
  }//for

  current = 0;
  let edges = generatedGraph.edges;
  let totalEdges = edges.length;
  for (i = 0; i < totalEdges; i++) {
    let edge = edges[i];
    console.log('source ', edge.source,  ' target ', edge.target);
    let e;
    if ( edge.hasOwnProperty('source') && edge.hasOwnProperty('target') ) {
      e = g.addEdge(edge.source.toString(), edge.target.toString());
    }
    e.setId(i);
    e.setLabel('friend');
    e.persist(i);
    e.persist().then((result) => {
      console.log("Edge " + edges.source, +" -> ", edges.target + " created. ", (current++) / totalEdges);
    }, (error) => {
      console.log("Error " + edges.source + " -> ", edges.target + " cannot be created. ", error, (current++) / totalEdges);
    });
  }//for

}, (s)=> {
  console.log('disconnected', s.id);
});
