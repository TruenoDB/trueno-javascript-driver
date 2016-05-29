"use strict";

/**
 * @author Victor O. Santos Uceta
 * RPC module with for WebSocket communication.
 * @module lib/core/communication/rpc
 * @see module:lib/core/worker
 */

/** Import modules */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ioClient = require('socket.io-client');
var Promise = require("bluebird");

/** Remote Procedure Call module for the database api workers */

var RPC = (function () {

  /**
   * Create a RCP object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function RPC() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, RPC);

    /* The database host */
    this._host = param.host || 'http://localhost';
    /* The database port */
    this._port = param.port || 8000;
    /* Exposed procedure functions for remote calls */
    this._procedures = [];
    /* Connected sockets (for server mode) */
    this._sockets = {};
    /* Connected socket (for client mode) */
    this._socket = null;
  }

  /* exporting the module */

  _createClass(RPC, [{
    key: "expose",
    value: function expose(procedureName, procedureFunction) {
      /* Insert the procedure in the collection */
      this._procedures.push({
        'name': procedureName,
        'fn': procedureFunction
      });
    }
  }, {
    key: "call",
    value: function call() {

      /* This instance object reference */
      var self = this;

      /* Extracting arguments */
      var upperArgs = arguments;

      /* Promise to be returned */
      return new Promise(function (resolve, reject) {

        /* Emit event on this socket */
        self._socket.emit.apply(self._socket, upperArgs);

        /* Await for response */
        self._socket.once('_' + upperArgs[0] + '_response', function (args) {
          resolve(args);
        });
      });
    }
  }, {
    key: "callAll",
    value: function callAll(event) {

      /* This instance object reference */
      var self = this;

      /* Extracting arguments */
      var upperArgs = arguments;

      /* Promise to be returned */
      return new Promise(function (resolve, reject) {
        var _arguments = arguments;

        /* Emit event on every socket */
        self._sockets.forEach(function (s) {
          /* Call the remote procedure for all sockets */
          s.emit.apply(s, upperArgs);
          /* Adding the response for the event */
          s.on('_' + event, function () {
            resolve.apply(null, _arguments);
          });
        });
      });
    }

    /**
     * Listen for connection at the assigned port or 8000 by default.
     */
  }, {
    key: "listen",
    value: function listen(connCallback, discCallback) {

      /* This instance object reference */
      var self = this;

      /* Listening for connections */
      var io_conn = require('socket.io').listen(this._port);

      /* Set connection */
      io_conn.on('connection', function (socket) {
        self._connect(socket, connCallback, discCallback);
      });
    }

    /**
     * Connect to a remote server.
     */
  }, {
    key: "connect",
    value: function connect(connCallback, discCallback) {

      /* This instance object reference */
      var self = this;

      /* Listening for connections */
      this._socket = ioClient.connect(this._host + ':' + this._port, { reconnect: true });

      /* Set connection event handler */
      this._socket.on('connect', function () {
        /* connect callback */
        self._connect(self._socket, connCallback, discCallback);
      });
    }

    /**
     * The socket connection handler.
     */
  }, {
    key: "_connect",
    value: function _connect(socket, connCallback, discCallback) {

      /* This instance object reference */
      var self = this;

      /* binding events */
      socket.on('disconnect', function () {
        self._disconnect(socket, discCallback);
      });

      /* Creating new socket object */
      var obj = {
        'socket': socket
      };

      /* Adding RPM functions */
      self._procedures.forEach(function (proc) {

        /* results function */
        var resFunc = function resFunc(args) {
          obj.socket.emit('_' + proc.name + '_response', args);
        };

        /* Adding listener to each call */
        obj.socket.on(proc.name, function (args) {
          proc.fn(resFunc, args);
        });
      });

      /* Adding socket to the collection and setting up remote call proxy */
      self._sockets[socket.id] = obj;

      /* Calling connected socket event */
      connCallback(socket);
    }

    /**
     * The socket disconnection handler.
     */
  }, {
    key: "_disconnect",
    value: function _disconnect(socket, discCallback) {
      /* Calling disconnect socket event */
      if (discCallback) {
        discCallback(socket);
      }
    }
  }]);

  return RPC;
})();

module.exports = RPC;