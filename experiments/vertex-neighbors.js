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
  g.setId(1);
  g.setLabel("graphi");

  let v = g.addVertex();

  v.setId(4);

  /* Create a filter */
  let filter = g.filter()
                .term('prop.name', 'bob');

  console.log('------------------------Neighbors-------------------------------');

  /* Get the out vertices, i.e outgoing neighbors */
  v._neighbors('v',filter,'out').then((vertices)=> {
    console.log('Total outgoing neighbors: ', vertices.length);
     vertices.forEach((v)=> {
        console.log(v);
            //vertices.push(new Vertex(v._source));
          });
  });

  v.out('v',filter).then((vertices)=> {
    vertices.forEach((v)=> {
        console.log(v);
    });
  });

/* Create a filter */
  let filter2 = g.filter()
                .term('prop.name', 'alice');
  /* Get the out vertices, i.e incoming neighbors */
  v._neighbors('v',filter2,'in').then((vertices)=> {
    console.log('Vertex neighbors: ', vertices);
  });

  v.in('v',filter2).then((vertices)=> {
    vertices.forEach((v)=> {
        console.log(v);
    });
  });


}, (s)=> {
  console.log('disconnected', s.id);
})