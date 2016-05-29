/**
 * Created by: victor on 5/29/16.
 * Source: .js
 * Author: victor
 * Description:
 *
 */

const Trueno = require('trueno-javascript-driver');

/* Instantiate connection */

let trueno = new Trueno();

trueno.connect((s)=>{

  console.log('connected', s.id);


  trueno.getGraph({p:'hello'}).then((result)=>{
    console.log(result);
  });


}, (s)=>{
  console.log('disconnected', s.id);
})