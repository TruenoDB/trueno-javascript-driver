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
  g.setLabel("db1029");

  let v = g.addVertex();
  v.setId(4);

  let alice = g.addVertex();
  alice.setId(1);

  let aura = g.addVertex();
  aura.setId(2);

  let alison = g.addVertex();
  alison.setId(3);

  let peter = g.addVertex();
  peter.setId(4);

  let cat = g.addVertex();
  cat.setId(5);

  let bob = g.addVertex();
  bob.setId(6);


  /* Create a filter */
  // let filter = g.filter()
  //               .term('prop.name', 'bob');

  console.log('------------------------Neighbors-------------------------------');

  /* Get the out vertices, i.e outgoing neighbors */
  // v._neighbors('v',filter,'out').then((vertices)=> {
  //   console.log('Total outgoing neighbors: ', vertices.length);
  //    vertices.forEach((v)=> {
  //       console.log(v);
  //           //vertices.push(new Vertex(v._source));
  //         });
  // });

  // v.out('v',filter).then((vertices)=> {
  //   vertices.forEach((v)=> {
  //       console.log(v);
  //   });
  // });

  /* Create a filter */
  // let filter2 = g.filter()
  //               .term('prop.name', 'alice');
  // /* Get the out vertices, i.e incoming neighbors */
  // v._neighbors('v',filter2,'in').then((vertices)=> {
  //   console.log('Total incoming neighbors: ', vertices.length);
  //   vertices.forEach((v)=> {
  //       console.log(v);
  //           //vertices.push(new Vertex(v._source));
  //         });
  // });

  // v.in('v',filter2).then((vertices)=> {
  //   vertices.forEach((v)=> {
  //       console.log(v);
  //   });
  // });

  /* Example from Vertex.id = 1 [alice] */
  let filterAlice = g.filter()
                     .term('prop.name', 'peter');
  //alice.out('v',filterAlice).then((vertices)=> {
  alice.out('v').then((vertices)=> {
    console.log("Outgoing vertices from alice");
    vertices.forEach((v)=> {
        console.log(v);
    });
  });
  // /* Result is: Vertex.id = 4  | (1) -> (4)   | (alice) -> (peter) */

  peter.out('v').then((vertices)=> {
    console.log("Outgoing vertices from peter");
    vertices.forEach((v)=> {
        console.log(v);
    });
  });
  /* Result is: Vertex.id = 5,6 | (cat), (bob) */

  peter.in('v').then((vertices)=> {
    console.log("Incoming vertices to peter");
    vertices.forEach((v)=> {
        console.log(v);
    });
  });
  /* Result is: Vertex.id = 1,2,3  | (alice), (aura), (alison) */

  aura.out('v').then((vertices)=> {
    console.log("Outgoing vertices from aura");
    vertices.forEach((v)=> {
      console.log(v);
    });
  });
  /* Result is: Vertex.id = 3  | (2) -> (1)   | (aura) -> (alice) */

  

  /******** Neighbors using Edges *****************/

  /* Match All of them / no filter */
  peter.out('e').then((edges)=> {
    console.log("Outgoing edges from peter");
    edges.forEach((e)=> {
        console.log(e);
    });
  });

  //   let filter = g.filter()
  //              .term('prop.since', 20);

  //   peter.out('e', filter).then((edges)=> {
  //   console.log("Outgoing edges to peter");
  //     edges.forEach((e)=> {
  //         console.log(e);
  //     });
  //   });

  //   /* Incoming Edges with the filter */
  //   peter.in('e', filter).then((edges)=> {
  //   console.log("Incoming edges to peter");
  //   edges.forEach((e)=> {
  //       console.log(e);
  //   });
  // });

}, (s)=> {
  console.log('disconnected', s.id);
})