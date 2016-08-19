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
  console.log('------------------------Properties, computed, and meta-------------------------------');
  /* Create a new Graph */
  let g = trueno.Graph();
  let v1 = g.addVertex();
  let v2 = g.addVertex();
  let v3 = g.addVertex();
  let e1 = g.addEdge(v1, v2);
  let e2 = g.addEdge(v1, 23);

  /* Adding properties */
  g.setProperty('version', 1);
  g.setLabel('mygraph');
  v1.setProperty('name', 'pepe');
  v1.setProperty('gender', 'M');
  v2.setProperty('name', 'juan');
  v3.setProperty('address', 'N river road');
  e1.setProperty('weight', 45);
  e2.setProperty('salary', 100);
  /* Removing property*/
  v1.removeProperty('gender');

  /* Adding computed */
  v1.setComputed('pagerank', 'top2', [[1, 4.32], [32, 4.01]]);
  v2.setComputed('pagerank', 'rank', 2.55);
  /* Removing computed */
  v2.removeComputed('pagerank', 'rank');

  /* display objects */
  console.log('g: ', g.properties(), g.computed(), g.meta(), g.getRef());
  console.log('v1: ', v1.properties(), v1.computed(), v1.meta(), v1.getRef());
  console.log('v2: ', v2.properties(), v2.computed(), v2.meta(), v2.getRef());
  console.log('v3: ', v3.properties(), v3.computed(), v3.meta(), v3.getRef());
  console.log('e1: ', e1.properties(), e1.computed(), e1.meta(), e1.getRef());
  console.log('e2: ', e2.properties(), e2.computed(), e2.meta(), e2.getRef());
  console.log('---------------------------Vertices----------------------------');
  /* display edges and vertices */
  g.vertices().map((v)=> {
    console.log(v.getRef());
  });
  console.log('---------------------------Edges----------------------------');
  g.edges().map((e)=> {
    console.log(e.getRef());
  });
  console.log('---------------------------Persist Calls----------------------------');
  /* persist g */
  g.persist().then((result) => {
    console.log("Graph g persisted", result);
  }, (error) => {
    console.log("Error: Graph g persistence failed", error);
  });
  ///* persist v1 */
  //v1.persist().then((result) => {
  //  console.log("Vertex v1 persisted", result);
  //}, (error) => {
  //  console.log("Error: Vertex v1 persistence failed", error);
  //});
  ///* persist v2 */
  //v2.persist().then((result) => {
  //  console.log("Vertex v2 persisted", result);
  //}, (error) => {
  //  console.log("Error: Vertex v2 persistence failed", error);
  //});
  ///* persist v3 */
  //v3.persist().then((result) => {
  //  console.log("Vertex v3 persisted", result);
  //}, (error) => {
  //  console.log("Error: Vertex v3 persistence failed", error);
  //});
  ///* persist e1 */
  //e1.persist().then((result) => {
  //  console.log("Edge e1 persisted", result);
  //}, (error) => {
  //  console.log("Error: Edge e1 persistence failed", error);
  //});
  ///* persist e2 */
  //e2.persist().then((result) => {
  //  console.log("Edge e2 persisted", result);
  //}, (error) => {
  //  console.log("Error: Edge e2 persistence failed", error);
  //});
  //
  //console.log('---------------------------Fetch Calls----------------------------');
  ///* fetch graphs */
  //g.fetch('g').then((graphs) => {
  //
  //}, (error) => {
  //
  //});
  ///* fetch vertices */
  //g.fetch('v').then((vertices) => {
  //
  //}, (error) => {
  //
  //});
  ///* fetch edges  */
  //g.fetch('e').then((edges) => {
  //
  //}, (error) => {
  //
  //});
  //console.log('---------------------------Count Calls----------------------------');
  ///* destroy the graph object */
  //g.count('g').then((result)=> {
  //  /* The graph will be deleted with all edges and vertices */
  //});
  //
  ///* destroy the vertices with such filter */
  //g.count('v').then((result)=> {
  //  /* here the two vertices v1 and v2 are persisted into the database */
  //});
  //
  ///* destroy the new and updated edges */
  //g.count('e').then((result)=> {
  //  /* here the edge v1 -> v2 is persisted into the database */
  //});


}, (s)=> {
  console.log('disconnected', s.id);
})