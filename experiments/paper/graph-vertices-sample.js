const Trueno = require('../lib/trueno');
/* Instantiate connection */
let trueno = new Trueno({host: host, port: port});

trueno.connect((s)=> {
  console.log('connected', s.id);
  /* Create a new Graph */
  let g = trueno.Graph();
  /* Set label: Graph Name */
  g.setLabel('citations');
  /* Create Vertices */
  let v1 = g.addVertex();
  let v2 = g.addVertex();
  /* Set custom ids */
  v1.setId(1);
  v1.setId(2);
  /* Adding properties */
  v1.setProperty('name', 'alice');
  v1.setProperty('age', '25');
  v2.setProperty('name', 'bob');
  v2.setProperty('age', '35');
  /* Persist v1, v2 */
  v1.persist().then((result) => {
    console.log('Vertex successfully created');
  }, (error) => {
    console.log('Error: ',error);
  });
  v2.persist().then((result) => {
    console.log('Vertex successfully created');
  }, (error) => {
    console.log('Error: ',error);
  });
  /* Create an edge between v1 and v2 */
  let e1 = g.addEdge(1, 2);
  e1.setId(1);
  e1.setProperty('relation', 'love');
  /* persist e1 */
  e1.persist().then((result) => {
    console.log('Edge successfully created');
  }, (error) => {
    console.log('Error: ', error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
});
