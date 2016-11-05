"use strict";

/**
 * @author Miguel Rivera
 * TruenoDB Javascript Driver Test Suite.
 */

const assert = require('assert');
const Trueno = require('../lib/trueno');

var t = new Trueno({host: 'http://localhost', port: 8000});

describe('Trueno Operations Tests', function () {
    before('Connect to database, create test graphs', function (done) {
        t.connect(function () {
            assert.equal(t._checkConnection(), true, 'Should be connected');

            let graphi = t.Graph('graphi');

            graphi.setProperty("version", 1);

            graphi.setComputed("pagerank", "average", 2.55);
            graphi.setComputed("pagerank", "low", 1);

            graphi.create().then((value) => {
                assert.ok(value);
                done();
            }).catch((reason) => {
                assert.fail(reason);
                done();
            });

        }, function () {
        });
    });

    it('Check Graph label validation', function () {
        let g = t.Graph();
        let p = g.create();

        return p.then(function () {
            return assert.fail(p.isFulfilled, 'undefined', 'Promise should be Rejected');
        }, function () {
            return assert.ok(p.isFulfilled !== 'undefined');
        });

    });

    it('Create Vertices', function () {
        let graphi = t.Graph('graphi');

        let v1 = graphi.addVertex();
        let v2 = graphi.addVertex();
        let v3 = graphi.addVertex();
        let v4 = graphi.addVertex();
        let v5 = graphi.addVertex();
        let v6 = graphi.addVertex();

        v1.setId(1);
        v2.setId(2);
        v3.setId(3);
        v4.setId(4);
        v5.setId(5);
        v6.setId(6);

        v1.setProperty('name', 'alice');
        v1.setProperty('age', '25');

        v2.setProperty('name', 'aura');
        v2.setProperty('age', '30');

        v3.setProperty('name', 'alison');
        v3.setProperty('age', '35');

        v4.setProperty('name', 'peter');
        v4.setProperty('age', '20');

        v5.setProperty('name', 'cat');
        v5.setProperty('age', '65');

        v6.setProperty('name', 'bob');
        v6.setProperty('age', '50');

        return Promise.all([
            v1.persist(),
            v2.persist(),
            v3.persist(),
            v4.persist(),
            v5.persist(),
            v6.persist()]).then((values) => {
            assert.deepEqual(values, ['1', '2', '3', '4', '5', '6']);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Create Edges', function () {
        let graphi = t.Graph('graphi');

        let e1 = graphi.addEdge(1, 4);//alice -> peter
        let e2 = graphi.addEdge(2, 1);//aura -> alice
        let e3 = graphi.addEdge(2, 3);//aura -> alison
        let e4 = graphi.addEdge(2, 4);//aura -> peter
        let e5 = graphi.addEdge(3, 4);//alison -> peter
        let e6 = graphi.addEdge(4, 5);//peter -> cat
        let e7 = graphi.addEdge(4, 6);//peter -> bob

        e1.setId(1);
        e2.setId(2);
        e3.setId(3);
        e4.setId(4);
        e5.setId(5);
        e6.setId(6);
        e7.setId(7);

        e1.setLabel('knows');
        e2.setLabel('knows');
        e3.setLabel('knows');
        e4.setLabel('knows');
        e5.setLabel('knows');
        e6.setLabel('knows');
        e7.setLabel('knows');

        e1.setProperty('since', 20);
        e2.setProperty('since', 15);
        e3.setProperty('since', 25);
        e4.setProperty('since', 20);
        e5.setProperty('since', 30);
        e6.setProperty('since', 10);
        e7.setProperty('since', 20);

        return Promise.all([
            e1.persist(),
            e2.persist(),
            e3.persist(),
            e4.persist(),
            e5.persist(),
            e6.persist(),
            e7.persist()]).then((values) => {
            assert.deepEqual(values, ['1', '2', '3', '4', '5', '6', '7']);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Update Vertices', function () {
        let graphi = t.Graph('graphi');

        let v1 = graphi.addVertex();
        let v2 = graphi.addVertex();

        v1.setId(1);
        v2.setId(2);

        v1.setProperty('name', 'pepe juan');
        v1.setProperty('gender', 'M');
        v2.setProperty('name', 'juan');
        v2.setComputed('pagerank', 'rank', 2.66);
        v2.setComputed('neighbors', 'best', [1, 2]);

        return Promise.all([
            v1.persist(),
            v2.persist()]).then((values) => {
            assert.deepEqual(values, ['1', '2']);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Update Edges', function () {
        let graphi = t.Graph('graphi');

        let e1 = graphi.addEdge(1, 2);
        let e2 = graphi.addEdge(2, 3);

        e1.setId(1);
        e2.setId(2);

        e1.setProperty('weight', 0);
        e1.setProperty('relation', 'friendship');
        e1.setProperty('weight', 11);
        e1.setProperty('relation', 'bussiness');
        e2.setComputed('pagerank', 'rank', -1);

        return Promise.all([
            e1.persist(),
            e2.persist()]).then((values) => {
            assert.deepEqual(values, ['1', '2']);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Insert Vertices and Edges in Batch mode', function () {
        let graphi = t.Graph('graphi');

        let v7 = graphi.addVertex();
        let v8 = graphi.addVertex();
        let v9 = graphi.addVertex();
        let v10 = graphi.addVertex();
        let v11 = graphi.addVertex();
        let v12 = graphi.addVertex();

        v7.setId(7);
        v8.setId(8);
        v9.setId(9);
        v10.setId(10);
        v11.setId(11);
        v12.setId(12);

        v7.setProperty('name', 'alice');
        v7.setProperty('age', '25');

        v8.setProperty('name', 'aura');
        v8.setProperty('age', '30');

        v9.setProperty('name', 'alison');
        v9.setProperty('age', '35');

        v10.setProperty('name', 'peter');
        v10.setProperty('age', '20');

        v11.setProperty('name', 'cat');
        v11.setProperty('age', '65');

        v12.setProperty('name', 'bob');
        v12.setProperty('age', '50');

        let e7 = graphi.addEdge(7, 10);//alice -> peter
        let e8 = graphi.addEdge(8, 7);//aura -> alice
        let e9 = graphi.addEdge(8, 9);//aura -> alison
        let e10 = graphi.addEdge(8, 10);//aura -> peter
        let e11 = graphi.addEdge(9, 10);//alison -> peter
        let e12 = graphi.addEdge(10, 11);//peter -> cat
        let e13 = graphi.addEdge(10, 12);//peter -> bob

        e7.setId(7);
        e8.setId(8);
        e9.setId(9);
        e10.setId(10);
        e11.setId(11);
        e12.setId(12);
        e13.setId(13);

        e7.setLabel('knows');
        e8.setLabel('knows');
        e9.setLabel('knows');
        e10.setLabel('knows');
        e11.setLabel('knows');
        e12.setLabel('knows');
        e13.setLabel('knows');

        e7.setProperty('since', 20);
        e8.setProperty('since', 15);
        e9.setProperty('since', 25);
        e10.setProperty('since', 20);
        e11.setProperty('since', 30);
        e12.setProperty('since', 10);
        e13.setProperty('since', 20);


        graphi.openBatch();

        e7.persist();
        e8.persist();
        e9.persist();
        e10.persist();
        e11.persist();
        e12.persist();

        e7.persist();
        e8.persist();
        e9.persist();
        e10.persist();
        e11.persist();
        e12.persist();
        e13.persist();

        return graphi.closeBatch().then((res) => {
            console.log(res);
        }, (err) => {
            assert.fail(err);
        })
    });

    it('Fetch with an empty result', function () {
        let graphi = t.Graph('graphi');

        let filter = graphi.filter().term('prop.relation', 'hate');

        return graphi.fetch('e', filter).then((res) => {
            assert.deepEqual(res, []);
        }, (err) => {
            assert.fail(err);
        });
    });

    it('Count information in Graph', function () {
        let graphi = t.Graph('graphi');

        let filter = graphi.filter().term('prop.name', 'juan');

        return Promise.all([
            graphi.count('v'),
            graphi.count('v', filter)]).then((values) => {
            assert.deepEqual(values, [12, 0]);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Fetch Graph information', function () {
        let graphi = t.Graph('graphi');

        graphi.filter().term('prop.version', '1');
        graphi.filter().term('prop.name', 'aura');

        return graphi.fetch('g').then((values) => {
            assert.equal(values.length, 1);
            assert.equal(values[0].getType(), 'g');
            assert.equal(values[0].getLabel(), 'graphi');
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Fetch and delete Edges', function () {
        let graphi = t.Graph('graphi');

        let promises = [];

        graphi.fetch('e').then((res) => {
            res.forEach((e) => {
                console.log(e);
                promises.push(e.destroy());
            });
        }, (err) => {
            assert.fail(err);
        });

        return Promise.all(promises).then((values) => {
            assert.notDeepEqual(values, []);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    it('Fetch and delete Vertices', function () {
        let graphi = t.Graph('graphi');

        let promises = [];

        graphi.fetch('v').then((res) => {
            res.forEach((v) => {
                console.log(v);
                promises.push(v.destroy);
            });
        }, (err) => {
            assert.fail(err);
        });

        return Promise.all(promises).then((values) => {
            assert.notDeepEqual(values, []);
        }).catch((reason) => {
            assert.fail(reason);
        });
    });

    after('Delete test graphs, disconnect', function (done) {
        let graphi = t.Graph('graphi');

        graphi.destroy().then((value) => {
            assert.ok(value);

            t.disconnect();

            assert.equal(t._checkConnection(), false, 'Should be disconnected');

            done();
        }).catch((reason) => {
            assert.fail(reason);
            done();
        });

    }, function (err) {
        assert.fail(err)
    });
})
;