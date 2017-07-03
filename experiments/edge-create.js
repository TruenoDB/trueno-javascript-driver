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
    console.log('------------------------Properties, computed, and meta-------------------------------');


    /* Create a new Graph */
    let g = trueno.Graph();

    /* Set label: very important */
    g.setLabel('graphi');

    let e1 = g.addEdge(1, 2);
    let e2 = g.addEdge(2, 3);
    let e3 = g.addEdge(1, 3);

    e1.setId(1);
    e2.setId(2);
    e3.setId(3);

    /* Adding properties and computed fields */
    e1.setProperty('weight', 35);
    e1.setProperty('relation', 'love');
    e1.setProperty('relation', 'hate');
    e2.setComputed('pagerank', 'rank', 5);
    e2.setProperty('weight', 45);
    e3.setProperty('relation', 'joy');
    e3.setProperty('weight', 20);

    /* persist e1 */
    e1.persist().then((result) => {
        console.log('Edge successfully created with id: ', e1.getId());
    }, (error) => {
        console.log('Edge persistence error: ', error);
    });
    /* persist e2 */
    e2.persist().then((result) => {
        console.log('Edge successfully created with id: ', e2.getId());
    }, (error) => {
        console.log('Edge persistence error: ', error);
    });
    /* persist e3 */
    e3.persist().then((result) => {
        console.log('Edge successfully created with id: ', e3.getId());
    }, (error) => {
        console.log('Edge persistence error: ', error);
    });

}, (s)=> {
    console.log('disconnected', s.id);
});
