"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the ThrusterDB graph database.
 * @module lib/trueno
 */

/** Import modules */
let RPC = require('./core/communication/rpc');
let Message = require('./core/communication/message');
let Graph = require('./core/data_structures/graph');
let Vertex = require('./core/data_structures/vertex');
let Edge = require('./core/data_structures/edge');

/** Trueno database driver class */
class Trueno {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc  = new RPC({host: this._host , port: this._port});
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

  _checkConnection(){

    if (!this._isConnected) {
      throw new Error('Client driver not connected to database.')
    }

  }

  /********************************* GRAPH EXTERNAL API METHODS *********************************/

  /**
   * Apply lazy bulk of operations on the remote database.
   * @param {Operations} Ops - The list of operations to apply.
   * @return {promise} The operation result promise.
   */
  _bulk(Ops) {

    /* validating connection */
    this._checkConnection();

    /* return promise with the async operation */
    return this._rpc.call('ex_bulk', Ops._operations);
  }

}



/* exporting the module */
module.exports = Trueno;