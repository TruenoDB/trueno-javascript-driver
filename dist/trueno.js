"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the ThrusterDB graph database.
 * @module lib/trueno
 */

/** Import modules */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var RPC = require('./core/communication/rpc');
var Graph = require('./core/data_structures/graph');
var Vertex = require('./core/data_structures/vertex');
var Edge = require('./core/data_structures/edge');

/** Trueno database driver class */

var Trueno = (function () {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Trueno() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Trueno);

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* RPC object */
    this._rpc = null;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc = new RPC({ host: this._host, port: this._port });
  }

  /* exporting the module */

  _createClass(Trueno, [{
    key: 'connect',
    value: function connect(cCallback, dCallback) {

      /* This instance object reference */
      var self = this;

      /* Set connection and disconnection callbacks */
      this._rpc.connect(function (s) {
        self._isConnected = true;
        cCallback(s);
      }, function (s) {
        self._isConnected = false;
        dCallback(s);
      });
    }
  }, {
    key: '_checkConnectionAndValidate',
    value: function _checkConnectionAndValidate(obj, oClass) {

      if (!this._isConnected) {
        throw new Error('Client driver not connected to database.');
      }
    }

    /********************************* GRAPH EXTERNAL API METHODS *********************************/

    /**
     * Create Graph on remote trueno database.
     * @param {Graph} g - The Graph to be created.
     * @return {promise} The operation result promise.
     */
  }, {
    key: 'createGraph',
    value: function createGraph(g) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(g, Graph);

      /* return promise with the async operation */
      return this._rpc.call('ex_createGraph', g);
    }

    /**
     * Update Graph on remote trueno database.
     * @param {Graph} g - The Graph to be updated.
     */
  }, {
    key: 'updateGraph',
    value: function updateGraph(g) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(g, Graph);

      /* return promise with the async operation */
      return this._rpc.call('ex_updateGraph', g);
    }

    /**
     * Delete Graph on remote trueno database.
     * @param {Graph} g - The Graph to be delete.
     */
  }, {
    key: 'deleteGraph',
    value: function deleteGraph(g) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(g, Graph);

      /* return promise with the async operation */
      return this._rpc.call('ex_deleteGraph', g);
    }

    /**
     * Get Graph from remote trueno database.
     * @param {Graph} g - The Graph to be requested.
     */
  }, {
    key: 'getGraph',
    value: function getGraph(g) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(g, Graph);

      /* return promise with the async operation */
      return this._rpc.call('ex_getGraph', g);
    }

    /**
     * Get Graph list from remote trueno database.
     * @param {Graph} g - The graph to be requested, fields will be used
     * as filters. Filtered Graphs will be returned in a array collection.
     */
  }, {
    key: 'getGraphList',
    value: function getGraphList(g) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(g, Graph);

      /* return promise with the async operation */
      return this._rpc.call('ex_getGraphList', g);
    }

    /********************************* VERTEX EXTERNAL API METHODS *********************************/

    /**
     * Create Vertex on remote trueno database.
     * @param {Vertex} v - The Vertex to be created.
     */
  }, {
    key: 'createVertex',
    value: function createVertex(v) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(v, Vertex);

      /* return promise with the async operation */
      return this._rpc.call('ex_createVertex', v);
    }

    /**
     * Update Vertex on remote trueno database.
     * @param {Vertex} v - The Vertex to be updated.
     */
  }, {
    key: 'updateVertex',
    value: function updateVertex(v) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(v, Vertex);

      /* return promise with the async operation */
      return this._rpc.call('ex_updateVertex', v);
    }

    /**
     * Delete Vertex on remote trueno database.
     * @param {Vertex} v - The Vertex to be delete.
     */
  }, {
    key: 'deleteVertex',
    value: function deleteVertex(v) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(v, Vertex);

      /* return promise with the async operation */
      return this._rpc.call('ex_deleteVertex', v);
    }

    /**
     * Get Vertex from remote trueno database.
     * @param {Vertex} v - The Vertex to be requested.
     */
  }, {
    key: 'getVertex',
    value: function getVertex(v) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(v, Vertex);

      /* return promise with the async operation */
      return this._rpc.call('ex_getVertex', v);
    }

    /**
     * Get Vertex list from remote trueno database.
     * @param {Vertex} v - The Vertex to be requested, fields will be used
     * as filters. Filtered vertices will be returned in a array collection.
     */
  }, {
    key: 'getVertexList',
    value: function getVertexList(v) {

      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(v, Vertex);

      /* return promise with the async operation */
      return this._rpc.call('ex_getVertexList', v);
    }

    /********************************* EDGE EXTERNAL API METHODS *********************************/

    /**
     * Create Edge on remote trueno database.
     * @param {Edge} e - The Edge to be created.
     */
  }, {
    key: 'createEdge',
    value: function createEdge(e) {
      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(e, Edge);

      /* return promise with the async operation */
      return this._rpc.call('ex_createEdge', e);
    }

    /**
     * Update Edge on remote trueno database.
     * @param {Edge} e - The Edge to be updated.
     */
  }, {
    key: 'updateEdge',
    value: function updateEdge(e) {
      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(e, Edge);

      /* return promise with the async operation */
      return this._rpc.call('ex_updateEdge', e);
    }

    /**
     * Delete Edge on remote trueno database.
     * @param {Edge} e - The Edge to be delete.
     */
  }, {
    key: 'deleteEdge',
    value: function deleteEdge(e) {
      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(e, Edge);

      /* return promise with the async operation */
      return this._rpc.call('ex_deleteEdge', e);
    }

    /**
     * Get Edge from remote trueno database.
     * @param {Edge} e - The Edge to be requested.
     */
  }, {
    key: 'getEdge',
    value: function getEdge(e) {
      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(e, Edge);

      /* return promise with the async operation */
      return this._rpc.call('ex_getEdge', e);
    }

    /**
     * Get Edge list from remote trueno database.
     * @param {Edge} e - The Edge to be requested, fields will be used
     * as filters. Filtered Edges will be returned in a array collection.
     */
  }, {
    key: 'getEdgeList',
    value: function getEdgeList(e) {
      /* This instance object reference */
      var self = this;

      /* validating connection */
      this._checkConnectionAndValidate(e, Edge);

      /* return promise with the async operation */
      return this._rpc.call('ex_getEdgeList', e);
    }
  }]);

  return Trueno;
})();

module.exports = Trueno;