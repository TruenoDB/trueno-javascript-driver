/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  console.log('connected', s.id);
  console.log('------------------------Properties, computed, and meta-------------------------------');


  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  let v1 = g.addVertex();
  let v2 = g.addVertex();
  let v3 = g.addVertex();

  /* Set custom ids */
  v1.setId(1);
  v2.setId(2);
  v3.setId(3);

  /* Adding properties and computed fields */
  v1.setProperty('name', 'pepe');
  v1.setProperty('gender', 'F');
  v2.setProperty('name', 'juan');
  v2.setComputed('pagerank', 'rank', 5);
  v3.setProperty('name', 'Rick');

  /* persist v1 */
  v1.persist().then((result) => {
    console.log('Vertex successfully created with id: ', result);
  }, (error) => {
    console.log('Vertex persistence error: ',error);
  });
  /* persist v2 */
  v2.persist().then((result) => {
    console.log('Vertex successfully created with id: ', result);
  }, (error) => {
    console.log('Vertex persistence error: ',error);
  });
  /* persist v3 */
  v3.persist().then((result) => {
    console.log('Vertex successfully created with id: ', result);
  }, (error) => {
    console.log('Vertex persistence error: ',error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})