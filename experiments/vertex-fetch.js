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
  
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  let v1 = g.addVertex();
  v1.setId(1);
  v1.setLabel('graphi');

  /* Create a filter */
  let filter = v1.filter()
                  .term('prop.name', 'pepe');
                  /*.range('prop.age', 'gt', 8)
                  .range('prop.age', 'lt', 22)
                  .exist('prop.salary')
                  .not()
                  .exist('prop.gender')
                  .wildcard('prop.gender', 'fe*')
                  .regexp('prop.name', 'fer.*o$')
                  .or()
                  .prefix('prop.name', 'au')
                  .limit(50);*/

  v1.fetch('v',filter).then((result) => {
    console.log('Vertex fetch', result);
  });


}, (s)=> {
  console.log('disconnected', s.id);
})