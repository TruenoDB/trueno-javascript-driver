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
  let v4 = g.addVertex();
  let v5 = g.addVertex();
  let v6 = g.addVertex();

  /* Set custom ids */
  v1.setId(1);
  v2.setId(2);
  v3.setId(3);
  v4.setId(4);
  v5.setId(5);
  v6.setId(6);

  /* Adding properties and computed fields */
  v1.setProperty('name', 'alice');
  v1.setProperty('age', '25');

  v2.setProperty('name', 'aura');
  v2.setProperty('age', '30');

  v3.setProperty('name', 'alison');
  v3.setProperty('age', '35');

  v4.setProperty('name', 'peter');
  v4.setProperty('age', '20');

  v5.setProperty('name', 'cat');
  v5.setProperty('age', '65');

  v6.setProperty('name', 'bob');
  v6.setProperty('age', '50');

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