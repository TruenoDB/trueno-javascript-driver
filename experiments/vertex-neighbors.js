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

  /* Create a new Graph */
  let g = trueno.Graph();
  let v = g.addVertex();

  g.setId(1);
  g.setLabel("graphi");
  v.setId(1);

  /* Create a filter */
  let filter = g.filter()
                .term('prop.name', 'peter');

  console.log('------------------------Neighbors-------------------------------');

  /* Get the out vertices, i.e outgoing neighbors */
  v._neighbors('v',filter,'out').then((vertices)=> {
    console.log('Vertex neighbors: ', vertices);
  });

    /* Get the out vertices, i.e incoming neighbors */
  v._neighbors('v',filter,'in').then((vertices)=> {
    console.log('Vertex neighbors: ', vertices);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})