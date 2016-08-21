"use strict";

/**
 * @author Victor O. Santos Uceta
 * Driver module for the ThrusterDB graph database.
 * @module lib/trueno
 */

/** Import modules */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Operation = require('./core/data_structures/operation');
var Message = require('./core/communication/message');
var _Graph = require('./core/data_structures/graph');
var RPC = require('./core/communication/rpc');

/** Trueno database driver class */

var Trueno = (function () {

  /**
   * Create a Trueno driver object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Trueno() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Trueno);

    /* internal debug flag */
    this.__debug = param.debug;

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* Connection flag */
    this._isConnected = false;
    /* New database rpc object */
    this._rpc = new RPC({ host: this._host, port: this._port });
    /* bulk operations */
    this._bulkOperations = [];
    /* Open bulk flag */
    this._isBulkOpen = false;
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
    key: '_checkConnection',
    value: function _checkConnection() {

      if (!this._isConnected) {
        throw new Error('Client driver not connected to database.');
      }
    }

    /********************************* Factories *********************************/

  }, {
    key: 'Graph',
    value: function Graph(label) {
      return new _Graph({ debug: this.__debug, conn: this, label: label });
    }

    /********************************* methods *********************************/

    /**
     * Open batch operation zone.
     */
  }, {
    key: 'openBatch',
    value: function openBatch() {
      this._isBulkOpen = true;
    }

    /**
     * Submit the batch operation in bulk into the database.
     * @return {Promise} - Promise with the bulk operations results.
     */
  }, {
    key: 'submitBatch',
    value: function submitBatch() {
      return this._bulk();
    }

    /**
     * Pushes the operation string and parameter into the bulk list.
     * @param {string} op - The operation to be inserted into the bulk list.
     * @param {object} param - The operation parameters.
     */
  }, {
    key: 'pushOperation',
    value: function pushOperation(op, param) {
      this._bulkOperations.push(new Operation({ op: op, param: param }));
    }

    /*********************** REMOTE OPERATIONS ***********************/
    /**
     * Execute all operation in the batch on one call.
     * @return {Promise} - Promise with the bulk operations results.
     */
  }, {
    key: '_bulk',
    value: function _bulk() {

      /* This instance object reference */
      var self = this;

      /* building the message */
      var msg = Message.buildMessage({ payload: { operations: self._bulkOperations } });

      /* return promise with the async operation */
      return new Promise(function (resolve, reject) {
        self._rpc.call('ex_bulk', msg).then(function (msg) {
          /* Set the bulk operations flag to false */
          self._isBulkOpen = false;
          resolve(msg.payload);
        }, function (err) {
          reject(err);
        });
      });
    }
  }]);

  return Trueno;
})();

module.exports = Trueno;