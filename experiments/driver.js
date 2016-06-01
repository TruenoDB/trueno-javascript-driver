/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */

let trueno = new Trueno({host:'http://localhost', port:8000});

trueno.connect((s)=>{

  console.log('connected', s.id);


  trueno.getGraph({p:'hello'}).then((g)=>{

    console.log(g);

  });

}, (s)=>{
  console.log('disconnected', s.id);
})