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
  console.log('------------------------Executing SQL Query-------------------------------');

  trueno.sql("SELECT * FROM citations where target = 9412200 or id = 9207078").then((result) => {
    console.log("Results from query", result);
  }, (error) => {
    console.log("Error: Query failed", error);
  });

}, (s)=> {
  console.log('disconnected', s.id);
})
