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
const Compute = require('./compute');
var Enums = require("./enums");
//const Joi = require('joi');

/* validation schema constant */
// const _schema = Joi.object().keys({
//   _id: Joi.alternatives().try(null, Joi.string()),
//   _directed: Joi.boolean().required(),
//   _dynamic: Joi.boolean().required(),
//   _multi: Joi.boolean().required(),
//   _label: Joi.string().required(),
//   _prop: Joi.object().required(),
//   _computed: Joi.object().required(),
//   _meta: Joi.object().required()
// });

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
    this.__compute = {};
    this.__bulkOperations = [];
    this.__isBulkOpen = false;

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
   * Creates a new filter to be applied to corresponding operations.
   * @return {Filter} - The new filter instance.
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
    return v;
  }

  /**
   * Creates a new edge associated with this graph.
   * @return {Edge} - The new edge.
   */
  addEdge(source, target) {
    let e = new Edge({debug: this.__debug, graph: this, source: source, target: target});
    return e;
  }

  /**
   * Deploy an algorithm in the Spark cluster via Spark Job Server
   * @return {Compute} - The new compute.
   */
  getCompute(pAlgorithm, parameters) {
    let c = new Compute({debug: this.__debug, graph: this, algorithm: pAlgorithm});
    this.__compute[c.getRef()] = c;
    return c;
  }

  vertices() {
    return _.values(this.__vertices);
  }

  edges() {
    return _.values(this.__edges);
  }

  /**
   * Open batch operation zone.
   */
  openBatch() {
    this.__isBulkOpen = true;
  }

  /**
   * Submit the batch operation in bulk into the database.
   * @return {Promise} - Promise with the bulk operations results.
   */
  closeBatch() {
    return this._bulk();
  }

  /**
   * Pushes the operation string and parameter into the bulk list.
   * @param {string} op - The operation to be inserted into the bulk list.
   * @param {object} obj - The operation object.
   */
  pushOperation(op, obj) {
    this.__bulkOperations.push({op: op, content: obj});
  }

  /**
   * Fetchs components from Elastic Search.
   * @return {Graph|Vertices[]|Edges[]} - The requested instantiated set of components.
   */
  fetch(cmp, ftr) {

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_fetch';

    /* The message reference */
    let msg;

    /* validate that graph label is present */
    self._validateGraphLabel();

    /* Extracting filters if provided */
    if (ftr) {
      ftr = ftr.getFilters();
    }
    /* validating component */
    self._validateCmp(cmp);
    /* building message */
    msg = Message.buildMessage({
      payload: {
        graph: self.getLabel(),
        type: cmp.toLowerCase(),
        ftr: ftr
      }
    });

    /* if debug display operation params */
    if (self.__debug) {
      console.log('DEBUG[fetch]: ', apiFunc, JSON.stringify(msg));
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {

        if (cmp == 'g') {
          let graphs = [];
          msg.forEach((g)=> {
            graphs.push(new Graph(g._source));
          });
          resolve(graphs);
        } else if (cmp == 'v') {
          let vertices = [];
          msg.forEach((v)=> {
            vertices.push(new Vertex(v._source));
          });
          resolve(vertices);
        } else if (cmp == 'e') {
          let edges = [];
          msg.forEach((e)=> {
            edges.push(new Edge(e._source));
          });
          resolve(edges);
        }
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

    /* validate that graph label is present */
    self._validateGraphLabel();

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
        resolve(msg.count);
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

    /* validate that graph label is present */
    self._validateGraphLabel();

    /* Set the id as label */
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

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        /* set incoming id */
        self.setId(msg._id);
        resolve(true);
      }, (error)=> {
        reject(error);
      });
    });
  }

  /**
   * Fetchs a graph from Elastic Search. If the component does not exists, the graph is created in the remote database.
   * @return {Graph} - The requested instantiated set of components.
   */
  open() {

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_open';

    /* The component to retrieve (graph) */
    let cmp = 'g';

    /* The message reference */
    let msg;

    /* validate that graph label is present */
    self._validateGraphLabel();

    /* Build this object properties */
    let obj = {};
    Object.keys(this).map((k)=> {
      if (!k.includes('__')) {
        obj[k.substring(1)] = self[k];
      }
    });

    /* validating component */
    self._validateCmp(cmp);
    /* building message */
    msg = Message.buildMessage({
      payload: {
        graph: self.getLabel(),
        type: cmp.toLowerCase(),
        mask: true,
        obj: obj,
        ftr: null
      }
    });

    /* if debug display operation params */
    if (self.__debug) {
      console.log('DEBUG[open]: ', apiFunc, JSON.stringify(msg));
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {

        if (cmp == 'g') {
          resolve(new Graph(msg._source));
        }
      }, (err)=> {
        reject(err);
      });
    });
  }

  /**
   * Execute all operation in the batch on one call.
   * @return {Promise} - Promise with the bulk operations results.
   */
  _bulk() {

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_bulk';

    /* validate that graph label is present */
    self._validateGraphLabel();

    /* if no operations to submit return empty promise */
    if (self.__bulkOperations.length === 0) {
      return new Promise((resolve, reject)=> {
        resolve({
          took: 0,
          errors: false,
          items: []
        });
      });
    }

    /* building the message */
    let msg = Message.buildMessage({payload: {graph: self.getLabel(), operations: self.__bulkOperations}});

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        /* Set the bulk operations flag to false */
        self.__isBulkOpen = false;
        self.__bulkOperations = [];
        resolve(msg);
      }, (err)=> {
        reject(err);
      });
    });
  }

}


/* exporting the module */
module.exports = Graph;
