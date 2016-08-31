"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the ThrusterDB graph database.
 * @module lib/trueno
 */

/** Import modules */
const Operation = require('./core/data_structures/operation');
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
    /* bulk operations */
    this._bulkOperations = [];
    /* Open bulk flag */
    this._isBulkOpen = false;
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

  _checkConnection() {

    if (!this._isConnected) {
      throw new Error('Client driver not connected to database.')
    }

  }

  /********************************* Factories *********************************/

  Graph(label) {
    return new Graph({debug: this.__debug, conn: this, label: label});
  }

  /********************************* methods *********************************/


  /**
   * Open batch operation zone.
   */
  openBatch() {
    this._isBulkOpen = true;
  }

  /**
   * Submit the batch operation in bulk into the database.
   * @return {Promise} - Promise with the bulk operations results.
   */
  submitBatch() {
    return this._bulk();
  }

  /**
   * Pushes the operation string and parameter into the bulk list.
   * @param {string} op - The operation to be inserted into the bulk list.
   * @param {object} param - The operation parameters.
   */
  pushOperation(op, param) {
    this._bulkOperations.push(new Operation({op: op, param: param}));
  }

  /*********************** REMOTE OPERATIONS ***********************/
  /**
   * Execute all operation in the batch on one call.
   * @return {Promise} - Promise with the bulk operations results.
   */
  _bulk() {

    /* This instance object reference */
    let self = this;

    /* building the message */
    let msg = Message.buildMessage({payload: {operations: self._bulkOperations}});

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self._rpc.call('ex_bulk', msg).then((msg)=> {
        /* Set the bulk operations flag to false */
        self._isBulkOpen = false;
        resolve(msg.payload);
      }, (err)=> {
        reject(err);
      });
    });
  }

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
              vertices.push(new Vertex(c._source));
              break;
            case 'e':
              edges.push(new Edge(c._source));
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