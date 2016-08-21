"use strict";

/**
 * @author Victor O. Santos Uceta
 * Edge class data structure.
 * @module lib/core/data_structures/edge
 * @see module:core/api/external-api
 */

/* class modules */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = require('../communication/message');
var Component = require('./component');
var Vertex = require('./vertex');
var Joi = require('joi');

/* validation schema constant */
var _schema = Joi.object().keys({
  _id: Joi.alternatives()['try'](null, Joi.number().integer()).required(),
  _source: Joi.alternatives()['try'](null, Joi.string(), Joi.number().integer()).required(),
  _target: Joi.alternatives()['try'](null, Joi.string(), Joi.number().integer()).required(),
  _partition: Joi.alternatives()['try'](null, Joi.number().integer()).required(),
  _label: Joi.string().required(),
  _properties: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The edge data structure class */

var Edge = (function (_Component) {
  _inherits(Edge, _Component);

  /**
   * Create a Edge object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Edge() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Edge);

    /* invoke super constructor */
    _get(Object.getPrototypeOf(Edge.prototype), 'constructor', this).call(this, param, 'e', param.graph);

    /* validate parameters */
    this._validateParams(param, 'source');
    this._validateParams(param, 'target');

    /* The source vertex id of the edge */
    this._source = param.source || null;
    /* The destination vertex id of the edge */
    this._target = param.target || null;
    /* The partition where the vertex resides */
    this._partition = param.partition || null;
    /* The relationship label */
    this._label = param.label || null;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  /* exporting the module */

  _createClass(Edge, [{
    key: '_validate',
    value: function _validate() {
      /* Validate this component with its schema */
      return Component.validate(this, _schema);
    }
  }, {
    key: '_validateParams',
    value: function _validateParams(param, endpoint) {
      if (param === undefined) param = {};

      /* Validating source */
      if (param[endpoint] && param[endpoint] instanceof Vertex) {
        /* if the id is null, add reference */
        if (param[endpoint].getId() == null) {
          param[endpoint] = param[endpoint].getRef();
        } else {
          param[endpoint] = param[endpoint].getId();
        }
      } else if (param[endpoint] !== null && !Number.isInteger(param[endpoint])) {
        throw new Error('Edge ' + endpoint + ' must be integer or null, value:', param[endpoint]);
      }
    }

    /*********************** GETTERS ***********************/

  }, {
    key: 'getSource',
    value: function getSource() {
      return this._source;
    }
  }, {
    key: 'getTarget',
    value: function getTarget() {
      return this._target;
    }
  }, {
    key: 'getPartition',
    value: function getPartition() {
      return this._partition;
    }

    /*********************** SETTERS ***********************/
  }, {
    key: 'setSource',
    value: function setSource(value) {
      this._source = value;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(value) {
      this._target = value;
    }
  }, {
    key: 'setPartition',
    value: function setPartition(value) {
      this._partition = value;
    }

    /*********************** REMOTE OPERATIONS ***********************/
    /**
     * Fetch both vertices attached to this edge.
     * @return {Promise} - Promise with the two vertices.
     */
  }, {
    key: 'vertices',
    value: function vertices() {

      /* This instance object reference */
      var self = this;
      var apiFunc = 'ex_vertices';

      if (!this.getId()) {
        /* Error if id is not present */
        throw new Error('Edge id is required, set this edge instance id or load edge.', this);
      }
      if (!this.__parentGraph.getId()) {
        /* Error if id is not present */
        throw new Error('Graph id is required ', this.__parentGraph);
      }

      /* building the message */
      var msg = Message.buildMessage({
        payload: {
          graph: this.__parentGraph.getId(),
          id: this.getId()
        }
      });

      /* if debug display operation params */
      if (this.__debug) {
        console.log('DEBUG[out]: ', apiFunc, msg);
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
  }]);

  return Edge;
})(Component);

module.exports = Edge;