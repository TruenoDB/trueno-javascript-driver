/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: true});

trueno.connect((s)=> {

  console.log('connected', s.id);

  /* Create a new Graph */
  let g = trueno.Graph();
  let v = g.addVertex();

  g.setId(1);
  v.setId(1);

  /* Create a filter */
  let filter = g.filter()
  .term('prop.name', 'pedro')
  .range('prop.age', 'gt', 8)
  .range('prop.age', 'lt', 22)
  .exist('prop.salary')
  .not()
  .exist('prop.gender')
  .wildcard('prop.gender', 'fe*')
  .regexp('prop.name', 'fer.*o$')
  .or()
  .prefix('prop.name', 'au')
  .limit(50);


  console.log('------------------------Neighbors-------------------------------');
  /* Get the out vertices, i.e outgoing neighbors */
  v.out('v',filter).then((vertices)=> {

  });

  /* Get the out edges, i.e outgoing edges */
  v.out('e').then((edges)=> {

  });

  /* Get the in vertices, i.e  incoming neighbors */
  v.in('v').then((vertices)=> {

  });

  /* Get the in edges, i.e  incoming edges */
  v.in('e', filter).then((edges)=> {

  });

  console.log('------------------------Degree-------------------------------');

  /* Get the in vertices, i.e  incoming neighbors */
  v.inDegree('v').then((count)=> {

  });
  /* Get the in vertices, i.e  incoming neighbors */
  v.inDegree('e', filter).then((count)=> {

  });
  /* Get the out edges, i.e outgoing edges */
  v.outDegree('v', filter).then((count)=> {

  });
  /* Get the out edges, i.e outgoing edges */
  v.outDegree('e').then((count)=> {

  });


}, (s)=> {
  console.log('disconnected', s.id);
})