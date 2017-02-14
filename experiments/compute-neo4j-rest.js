/**
 * graph-compute-neo4j.js
 * This file connects to neo4j and retrieve pakeranks
 *
 * @version 0.0.1
 * @author  Victor, Servio
 * @updated 2017.02.13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * Do NOT forget to reference the ORIGINAL author of the code. Be nice!
 */


let r=require("request");
let txUrl = "http://172.17.0.4:7474/db/data/transaction/commit";

function cypher(query,params,cb) {
  r.post({uri:txUrl,
      json:{statements:[{statement:query,parameters:params}]}},
    function(err,res) { cb(err,res.body)})
}

//let query="MATCH (n) RETURN n";
//let query="MATCH (a)-[:INTERACTION]-()  RETURN DISTINCT id(a) as id, a.pagerank as pagerank  ORDER BY pagerank DESC";
let query="MATCH (a)-[:INTERACTION]-()  RETURN DISTINCT id(a) as id, a.pagerank as pagerank  ORDER BY pagerank DESC";
let params={limit: 10};
let cb=function(err,data) {
   if(data.results[0].hasOwnProperty("data")){ 
     console.log(data.results[0].columns);
   } else {
     console.log("Empty"); 
    }
};//console.log(JSON.stringify(data)); };

cypher(query,params,cb);
