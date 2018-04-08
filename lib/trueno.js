"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the TruenoDB graph database.
 * @module lib/trueno
 */

/** Import modules */
const Message = require('./core/communication/message');
const Graph = require('./core/data_structures/graph');
const RPC = require('./core/communication/rpc');
const Vertex = require('./core/data_structures/vertex');
const Edge = require('./core/data_structures/edge');

/** Trueno database driver class */
class Trueno {

    /**
     * Create a Trueno driver object instance.
     * @param {object} [param= {}] - Parameter with default value of object {}.
     */
    constructor(param = {}) {

        /* internal debug flag */
        this.__debug = param.debug;

        /* The database host */
        this._host = param.host || 'http://localhost';
        /* The database port */
        this._port = param.port || 8000;
        /* Connection flag */
        this._isConnected = false;
        /* New database rpc object */
        this._rpc = new RPC({host: this._host, port: this._port});
    }

    connect(cCallback, dCallback) {

        /* This instance object reference */
        let self = this;

        /* Set connection and disconnection callbacks */
        this._rpc.connect((s)=> {
            self._isConnected = true;
            cCallback(s);
        }, (s)=> {
            self._isConnected = false;
            dCallback(s);
        });
    }

    disconnect() {
        this._rpc.disconnect();
    }

    _checkConnection() {

        return this._isConnected;
        // if (!this._isConnected) {
        //     throw new Error('Client driver not connected to database.')
        // }

    }

    /********************************* Factories *********************************/

    Graph(label) {
        return new Graph({debug: this.__debug, conn: this, label: label});
    }


    /*********************** REMOTE OPERATIONS ***********************/
    /**
     * Execute SQL .
     * @param {string} query - The sql query to be executed in the backend.
     * @return {Promise} - Promise with the SQL operations results.
     */
    sql(query) {

        /* This instance object reference */
        let self = this;

        /* building the message */
        let msg = Message.buildMessage({payload: {q: query}});

        /* return promise with the async operation */
        return new Promise((resolve, reject)=> {
            self._rpc.call('ex_sql', msg).then((msg)=> {
                let vertices = [], edges = [];
                msg.forEach((c)=> {
                    switch (c._type) {
                        case 'v':
                            var v = new Vertex(c._source);
                            v.setId(c._id);
                            vertices.push(v);
                            break;
                        case 'e':
                            var e = new Edge(c._source);
                            e.setId(c._id);
                            edges.push(e);
                            break;
                    }
                });
                resolve({v: vertices, e: edges});
            }, (err)=> {
                reject(err);
            });
        });
    }

}


/* exporting the module */
module.exports = Trueno;
