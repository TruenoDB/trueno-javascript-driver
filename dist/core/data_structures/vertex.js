"use strict";

/**
 * @author Victor O. Santos Uceta
 * Vertex class data structure.
 * @module lib/core/data_structures/vertex
 * @see module:core/api/external-api
 */

/* class modules */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = require('../communication/message');
var Component = require('./component');
var Joi = require('joi');

/* validation schema constant */
var _schema = Joi.object().keys({
  _id: Joi.alternatives()['try'](null, Joi.number().integer()).required(),
  _partition: Joi.alternatives()['try'](null, Joi.number().integer()).required(),
  _label: Joi.string().required(),
  _properties: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The edge data structure class */

var Vertex = (function (_Component) {
  _inherits(Vertex, _Component);

  /**
   * Create a Vertex object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Vertex() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Vertex);

    /* invoke super constructor */
    _get(Object.getPrototypeOf(Vertex.prototype), 'constructor', this).call(this, param, 'v', param.graph);

    /* The partition where the vertex resides */
    this._partition = param.partition || null;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  /* exporting the module */

  _createClass(Vertex, [{
    key: '_validate',
    value: function _validate() {
      /* Validate this component with its schema */
      return Component.validate(this, _schema);
    }

    /*********************** GETTERS AND SETTERS ***********************/

  }, {
    key: 'getPartition',
    value: function getPartition() {
      return this._partition;
    }
  }, {
    key: 'setPartition',
    value: function setPartition(value) {
      this._partition = value;
    }

    /*********************** REMOTE OPERATIONS ***********************/
    /**
     * Retrieve incoming vertices or edges from the remote database, if no
     * filter is supplied, all vertices or edges will be retrieved(NOT RECOMMENDED).
     * @param {string} cmp - The component type, can be 'v','V', 'e','E'
     * @param {Filter} [ftr] - The filter to be applied.
     * @return {Promise} - Promise with the incoming component results.
     */
  }, {
    key: 'in',
    value: function _in(cmp, ftr) {
      return this._neighbors(cmp, ftr, 'in');
    }

    /**
     * Retrieve outgoing vertices or edges from the remote database, if no
     * filter is supplied, all vertices or edges will be retrieved(NOT RECOMMENDED).
     * @param {string} cmp - The component type, can be 'v','V', 'e','E'
     * @param {Filter} [ftr] - The filter to be applied.
     * @return {Promise} - Promise with the outgoing component results.
     */
  }, {
    key: 'out',
    value: function out(cmp, ftr) {
      return this._neighbors(cmp, ftr, 'out');
    }

    /**
     * Retrieve outgoing vertices or edges from the remote database(helper function)
     * @param {string} cmp - The component type, can be 'v','V', 'e','E'
     * @param {Filter} [ftr] - The filter to be applied.
     * @return {Promise} - Promise with the outgoing component results.
     */
  }, {
    key: '_neighbors',
    value: function _neighbors(cmp, ftr, dir) {

      /* Validate the component */
      this._validateCmp(cmp);

      /* This instance object reference */
      var self = this;
      var apiFunc = 'ex_neighbors';

      if (!this.getId()) {
        /* Error if id is not present */
        throw new Error('Vertex id is required ', this);
      }
      if (!this.__parentGraph.getLabel()) {
        /* Error if id is not present */
        throw new Error('Graph label is required, set this graph instance label or load graph.', this.__parentGraph);
      }

      /* Extracting filters if provided */
      if (ftr) {
        ftr = ftr.getFilters();
      }

      /* building the message */
      var msg = Message.buildMessage({
        payload: {
          graph: this.__parentGraph.getLabel(),
          id: this.getId(),
          dir: dir,
          cmp: cmp.toLowerCase(),
          ftr: ftr
        }
      });

      /* if debug display operation params */
      if (this.__debug) {
        console.log('DEBUG[out]: ', apiFunc, apiFunc, JSON.stringify(msg));
      }

      /* return promise with the async operation */
      return new Promise(function (resolve, reject) {
        self.__parentGraph.__conn._rpc.call(apiFunc, msg).then(function (msg) {
          resolve(msg.payload);
        }, function (err) {
          reject(err);
        });
      });
    }

    /**
     * Retrieve incoming degree with respect to vertices or edges from the remote database, if no
     * filter is supplied, the edge and vertex degree will be the same.
     * @param {string} cmp - The component type, can be 'v','V', 'e','E'
     * @param {Filter} [ftr] - The filter to be applied.
     * @return {Promise} - Promise with the in degree results.
     */
  }, {
    key: 'inDegree',
    value: function inDegree(cmp, ftr) {
      return this._degree(cmp, ftr, 'in');
    }

    /**
     * Retrieve outgoing degree with respect to vertices or edges from the remote database, if no
     * filter is supplied, the edge and vertex degree will be the same.
     * @param {string} cmp - The component type, can be 'v','V', 'e','E'
     * @param {Filter} [ftr] - The filter to be applied.
     * @return {Promise} - Promise with the out degree results.
     */
  }, {
    key: 'outDegree',
    value: function outDegree(cmp, ftr) {
      return this._degree(cmp, ftr, 'out');
    }

    /**
     * Retrieve {in|out} degree with respect to vertices or edges from the remote database(helper function).
     * @param {string} cmp - The component type, can be 'v','V', 'e','E'
     * @param {Filter} [ftr] - The filter to be applied.
     * @return {Promise} - Promise with the out degree results.
     */
  }, {
    key: '_degree',
    value: function _degree(cmp, ftr, dir) {

      /* Validate the component */
      this._validateCmp(cmp);

      /* This instance object reference */
      var self = this;
      var apiFunc = 'ex_degree';

      if (!this.getId()) {
        /* Error if id is not present */
        throw new Error('Vertex id is required ', this);
      }
      if (!this.__parentGraph.getLabel()) {
        /* Error if id is not present */
        throw new Error('Graph label is required, set this graph instance label or load graph.', this.__parentGraph);
      }

      /* Extracting filters if provided */
      if (ftr) {
        ftr = ftr.getFilters();
      }

      /* building the message */
      var msg = Message.buildMessage({
        payload: {
          graph: this.__parentGraph.getLabel(),
          id: this.getId(),
          dir: dir,
          cmp: cmp.toLowerCase(),
          ftr: ftr
        }
      });

      /* if debug display operation params */
      if (this.__debug) {
        console.log('DEBUG[' + dir + 'Degree]: ', apiFunc, JSON.stringify(msg));
      }

      /* return promise with the async operation */
      return new Promise(function (resolve, reject) {
        self.__parentGraph.__conn._rpc.call(apiFunc, msg).then(function (msg) {
          resolve(msg.payload);
        }, function (err) {
          reject(err);
        });
      });
    }
  }, {
    key: '_validateCmp',
    value: function _validateCmp(cmp) {
      if (!/v|V|e|E/g.test(cmp)) {
        throw new Error("Component must be one of the following: 'v','V', 'e','E', provided value:", cmp);
      }
    }
  }]);

  return Vertex;
})(Component);

module.exports = Vertex;