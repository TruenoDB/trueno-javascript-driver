/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: Servio
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  console.log('connected', s.id);
  console.log('------------------------Constructing Neighbors() Building Block Example-------------------------------');

  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  /* Adding properties and computed fields */
  g.setProperty('version', 1);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g created", result);

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

    /* Edges */
    let e1 = g.addEdge(1,4);//alice -> peter
    let e2 = g.addEdge(2,1);//aura -> alice
    let e3 = g.addEdge(2,3);//aura -> alison
    let e4 = g.addEdge(2,4);//aura -> peter
    let e5 = g.addEdge(3,4);//alison -> peter
    let e6 = g.addEdge(4,5);//peter -> cat
    let e7 = g.addEdge(4,6);//peter -> bob

    /* Adding properties and labels */
    e1.setLabel('knows');
    e2.setLabel('knows');
    e3.setLabel('knows');
    e4.setLabel('knows');
    e5.setLabel('knows');
    e6.setLabel('knows');
    e7.setLabel('knows');

    e1.setProperty('since', 20);
    e2.setProperty('since', 15);
    e3.setProperty('since', 25);
    e4.setProperty('since', 20);
    e5.setProperty('since', 30);
    e6.setProperty('since', 10);
    e7.setProperty('since', 20);

    /* Persisting vertices */

    /* persist everything into a batch */
    g.openBatch();

    /* Persisting vertices */
    v1.persist();
    v2.persist();
    v3.persist();
    v4.persist();
    v5.persist();
    v6.persist();

    /* Persisting edges */
    e1.persist();
    e2.persist();
    e3.persist();
    e4.persist();
    e5.persist();
    e6.persist();
    e7.persist();

    /* Push the batch operations */
    g.closeBatch().then((result) => {
      console.log('Batch pushed: ', result);
    }, (error) => {
      console.log('Batch operation failed: ',error);
    });

  }, (error) => {
    console.log("Error: Graph g creation failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})