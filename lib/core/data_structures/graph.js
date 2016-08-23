"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph class data structure.
 * @module lib/core/data_structures/graph
 * @see module:core/api/external-api
 */

/* class modules */
const Message = require('../communication/message');
const Component = require('./component');
const Promise = require('bluebird');
const Filter = require('./filter')
const Vertex = require('./vertex');
const Edge = require('./edge');
const _ = require('lodash');
const Joi = require('joi');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.string()),
  _directed: Joi.boolean().required(),
  _dynamic: Joi.boolean().required(),
  _multi: Joi.boolean().required(),
  _label: Joi.string().required(),
  _properties: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The graph data structure class */
class Graph extends Component {
  /**
   * Create a Graph object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param, 'g', null);

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

  _validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  /*********************** GETTERS ***********************/

  getName() {
    return this._name;
  }

  isDirected() {
    return this._directed;
  }

  isDynamic() {
    return this._dynamic;
  }

  isMulti() {
    return this._multi;
  }

  /*********************** SETTERS ***********************/

  setDirected(value) {
    this._directed = value;
  }

  setDynamic(value) {
    this._dynamic = value;
  }

  setMulti(value) {
    this._multi = value;
  }

  /*********************** OPERATIONS ***********************/

  /**
   * Creates a new edge associated with this graph.
   * @return {Filter} - The new edge.
   */
  filter() {
    return new Filter();
  }

  /**
   * Creates a new vertex associated with this graph.
   * @return {Vertex} - The new vertex.
   */
  addVertex() {
    let v = new Vertex({debug: this.__debug, graph: this});
    this.__vertices[v.getRef()] = v;
    return v;
  }

  /**
   * Creates a new edge associated with this graph.
   * @return {Edge} - The new edge.
   */
  addEdge(source, target) {
    let e = new Edge({debug: this.__debug, graph: this, source: source, target: target});
    this.__edges[e.getRef()] = e;
    return e;
  }

  vertices() {
    return _.values(this.__vertices);
  }

  edges() {
    return _.values(this.__edges);
  }

  /*********************** REMOTE OPERATIONS ***********************/
  /**
   * Fetch components from the remote database.
   * @param {string} cmp - The component type, can be 'v','V', 'e','E', 'g', or 'G'
   * @param {Filter} [ftr] - The filter to be applied
   * @return {Promise} - Promise with the fetch results.
   */
  fetch(cmp, ftr) {

    /* Validate the component */
    this._validateCmp(cmp);

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_fetch';

    if (!this.getLabel()) {
      /* Error if id is not present */
      throw new Error('Graph label is required, set this graph instance label or load graph.', this);
    }
    /* Extracting filters if provided */
    if (ftr) {
      ftr = ftr.getFilters();
    }

    /* building the message */
    let msg = Message.buildMessage({payload: {graph: this.getLabel(), type: cmp.toLowerCase(), ftr: ftr}});

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[fetch]: ', apiFunc, JSON.stringify(msg));
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        resolve(msg.payload);
      }, (err)=> {
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
  count(cmp, ftr) {

    /* Validate the component */
    this._validateCmp(cmp);

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_count';

    if (!this.getLabel()) {
      /* Error if id is not present */
      throw new Error('Graph label is required, set this graph instance label or load graph.', this);
    }
    /* Extracting filters if provided */
    if (ftr) {
      ftr = ftr.getFilters();
    }

    /* building the message */
    let msg = Message.buildMessage({payload: {graph: this.getLabel(), type: cmp.toLowerCase(), ftr: ftr}});

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[count]: ', apiFunc, msg);
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        resolve(msg.payload);
      }, (err)=> {
        reject(err);
      });

    });
  }

  /**
   * Create graph in the remote database.
   */
  create() {
    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_create';

    /* If label is not present throw error */
    if (!this.getLabel()) {
      throw new Error('Graph label is required');
    }

    /* Set the id */
    this.setId(this.getLabel());

    /* Build this object properties */
    let obj = {};
    Object.keys(this).map((k)=> {
      if (!k.includes('__')) {
        obj[k.substring(1)] = self[k];
      }
    });

    /* building the message */
    let msg = Message.buildMessage({
      payload: {
        graph: this.getLabel(),
        type: this.__type,
        obj: obj
      }
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[create]: ', apiFunc, JSON.stringify(msg));
    }

    /* if bulk area is open, push and return */
    if (this.__conn._isBulkOpen) {
      this.__parentGraph.__conn.pushOperation(apiFunc, msg);
      return;
    }
    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        /* set incoming id */
        self.setId(msg._id);
        resolve(msg._id);
      }, (error)=> {
        reject(error);
      });
    });
  }

  _validateCmp(cmp) {
    if (!(/v|V|e|E|g|G/g).test(cmp)) {
      throw new Error("Component must be one of the following: 'v','V', 'e','E', 'g', or 'G', provided value:", cmp);
    }
  }

}


/* exporting the module */
module
  .exports = Graph;