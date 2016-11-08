/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');
const edges = require('./citation-edges.json');
const vertices = require('./citation-vertices.json');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('citations');

  let vQueue = Object.keys(vertices);
  let total = vQueue.length, current = 0;

  /* Insertion function */
  function insertVertex(vkey){
    let v = g.addVertex();
    v.setId(parseInt(vkey));
    v.setLabel('paper');
    v.setProperty("title", vertices[vkey].title);
    v.persist().then((result) => {
      console.log("Vertex " + vkey + " created. ",(current++)/total);
      /* Continue inserting */
      if(vQueue.length){
        insertVertex(vQueue.shift());
      }else{
        process.exit();
      }
    }, (error) => {
      console.log("Error: Vertex " + vkey + " creation failed", error, (current++)/total);
      /* Continue inserting */
      if(vQueue.length){
        insertVertex(vQueue.shift());
      }else{
        process.exit();
      }
    });
  }
  /* Initiating vertex insertion */
  insertVertex(vQueue.shift());

}, (s)=> {
  console.log('disconnected', s.id);
});
