"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph class data structure.
 * @module lib/core/data_structures/graph
 * @see module:core/api/external-api
 */

/* class modules */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = require('../communication/message');
var Component = require('./component');
var Filter = require('./filter');
var Vertex = require('./vertex');
var Edge = require('./edge');
var _ = require('lodash');
var Joi = require('joi');

/* validation schema constant */
var _schema = Joi.object().keys({
  _id: Joi.alternatives()['try'](null, Joi.string()),
  _directed: Joi.boolean().required(),
  _dynamic: Joi.boolean().required(),
  _multi: Joi.boolean().required(),
  _label: Joi.string().required(),
  _properties: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The graph data structure class */

var Graph = (function (_Component) {
  _inherits(Graph, _Component);

  /**
   * Create a Graph object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Graph() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Graph);

    /* invoke super constructor */
    _get(Object.getPrototypeOf(Graph.prototype), 'constructor', this).call(this, param, 'g', null);

    /* internal properties */
    this.__conn = param.conn || null;
    this.__vertices = {};
    this.__edges = {};

    /* If true, graph is directed, if false is undirected(default) */
    this._directed = param.directed || true;
    /* True if the graph is dynamic, default static */
    this._dynamic = param.dynamic || false;
    /* True if the graph is a multi graph(parallel edges between same vertices */
    this._multi = param.multi || false;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  /* exporting the module */

  _createClass(Graph, [{
    key: '_validate',
    value: function _validate() {
      /* Validate this component with its schema */
      return Component.validate(this, _schema);
    }

    /*********************** GETTERS ***********************/

  }, {
    key: 'getName',
    value: function getName() {
      return this._name;
    }
  }, {
    key: 'isDirected',
    value: function isDirected() {
      return this._directed;
    }
  }, {
    key: 'isDynamic',
    value: function isDynamic() {
      return this._dynamic;
    }
  }, {
    key: 'isMulti',
    value: function isMulti() {
      return this._multi;
    }

    /*********************** SETTERS ***********************/

  }, {
    key: 'setDirected',
    value: function setDirected(value) {
      this._directed = value;
    }
  }, {
    key: 'setDynamic',
    value: function setDynamic(value) {
      this._dynamic = value;
    }
  }, {
    key: 'setMulti',
    value: function setMulti(value) {
      this._multi = value;
    }

    /*********************** OPERATIONS ***********************/

    /**
     * Creates a new edge associated with this graph.
     * @return {Filter} - The new edge.
     */
  }, {
    key: 'filter',
    value: function filter() {
      return new Filter();
    }

    /**
     * Creates a new vertex associated with this graph.
     * @return {Vertex} - The new vertex.
     */
  }, {
    key: 'addVertex',
    value: function addVertex() {
      var v = new Vertex({ debug: this.__debug, graph: this });
      this.__vertices[v.getRef()] = v;
      return v;
    }

    /**
     * Creates a new edge associated with this graph.
     * @return {Edge} - The new edge.
     */
  }, {
    key: 'addEdge',
    value: function addEdge(source, target) {
      var e = new Edge({ debug: this.__debug, graph: this, source: source, target: target });
      this.__edges[e.getRef()] = e;
      return e;
    }
  }, {
    key: 'vertices',
    value: function vertices() {
      return _.values(this.__vertices);
    }
  }, {
    key: 'edges',
    value: function edges() {
      return _.values(this.__edges);
    }

    /*********************** REMOTE OPERATIONS ***********************/
    /**
     * Fetch components from the remote database.
     * @param {string} cmp - The component type, can be 'v','V', 'e','E', 'g', or 'G'
     * @param {Filter} [ftr] - The filter to be applied
     * @return {Promise} - Promise with the fetch results.
     */
  }, {
    key: 'fetch',
    value: function fetch(cmp, ftr) {

      /* Validate the component */
      this._validateCmp(cmp);

      /* This instance object reference */
      var self = this;
      var apiFunc = 'ex_fetch';

      if (!this.getLabel()) {
        /* Error if id is not present */
        throw new Error('Graph label is required, set this graph instance label or load graph.', this);
      }
      /* Extracting filters if provided */
      if (ftr) {
        ftr = ftr.getFilters();
      }

      /* building the message */
      var msg = Message.buildMessage({ payload: { graph: this.getLabel(), type: cmp.toLowerCase(), ftr: ftr } });

      /* if debug display operation params */
      if (this.__debug) {
        console.log('DEBUG[fetch]: ', apiFunc, JSON.stringify(msg));
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
     * Count components at the remote database.
     * @param {string} cmp - The component type, can be 'v','V', 'e','E', 'g', or 'G'
     * @param {Filter} [ftr] - The filter to be applied
     * @return {Promise} - Promise with the count result.
     */
  }, {
    key: 'count',
    value: function count(cmp, ftr) {

      /* Validate the component */
      this._validateCmp(cmp);

      /* This instance object reference */
      var self = this;
      var apiFunc = 'ex_count';

      if (!this.getLabel()) {
        /* Error if id is not present */
        throw new Error('Graph label is required, set this graph instance label or load graph.', this);
      }
      /* Extracting filters if provided */
      if (ftr) {
        ftr = ftr.getFilters();
      }

      /* building the message */
      var msg = Message.buildMessage({ payload: { graph: this.getLabel(), type: cmp.toLowerCase(), ftr: ftr } });

      /* if debug display operation params */
      if (this.__debug) {
        console.log('DEBUG[count]: ', apiFunc, msg);
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
      if (!/v|V|e|E|g|G/g.test(cmp)) {
        throw new Error("Component must be one of the following: 'v','V', 'e','E', 'g', or 'G', provided value:", cmp);
      }
    }
  }]);

  return Graph;
})(Component);

module.exports = Graph;