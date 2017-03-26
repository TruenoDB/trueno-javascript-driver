"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Import modules */
const fs = require('fs');

const srcfolder = './data/';

/* config this objects according to the files */
const nodes = [
  {file: 'nodes',  label: 'some',    id: 'vertexId'}
  ];
const relationships = [
  {file: 'rels',   label: 'connected', src: 'vertexId', dst: 'vertexId'}
  ];

let currentVertex = 0;
let currentEdge   = 0;

let vertices = {}
let edges = {}
let keys = {};


function getNodes() {
  nodes.forEach((fn) => {
    let json = require(`${srcfolder}${fn.file}`);

    /* init keys */
    keys[fn.id] = {};

    console.log('file: ' + fn.file);

    /* iterate over all vertices */
    json.forEach((item) => {
      currentVertex++;
      vertices[currentVertex] = {};
      vertices[currentVertex].id = currentVertex;
      vertices[currentVertex].label = fn.label;

      /* iterate fields */
      for (let prop in item) {
        vertices[currentVertex][prop] = item[prop];
        if (prop.endsWith("Id")) {
          keys[prop][item[prop]] = currentVertex;
        }
      }

    });
  });
}

function getEdges() {
  relationships.forEach((fn) => {
    let json = require(`${srcfolder}${fn.file}`);

    console.log('file: ' + fn.file);
    // console.log(keys);

    /* iterate over all edges */
    json.forEach((item) => {
      currentEdge++;
      // console.log('--> ', fn.src, ' => ', item.source, ' * ', fn.dst, ' => ', item.target);
      edges[currentEdge] = {};
      edges[currentEdge].source = keys[fn.src][item.source];
      edges[currentEdge].destination = keys[fn.dst][item.target];
      edges[currentEdge].label = fn.label;

    });
  });
}

function toJSON(out, entity) {
  let fname = `${srcfolder}${out}`;
  fs.writeFile(fname, JSON.stringify(entity), (err) => {
    if (err) throw err;
    console.log(`${out} saved!`);
  })
}


/* get nodes */
getNodes();
/* get edges */
getEdges();

/* output data */
toJSON('vertices.json', vertices);
toJSON('edges.json', edges);

/* stats */
console.log('Total vertices: ', currentVertex);
console.log('Total edges:    ', currentEdge);
