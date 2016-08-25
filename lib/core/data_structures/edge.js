"use strict";

/**
 * @author Victor O. Santos Uceta
 * Edge class data structure.
 * @module lib/core/data_structures/edge
 * @see module:core/api/external-api
 */

/* class modules */
const Message = require('../communication/message');
const Component = require('./component');
const Vertex = require('./vertex');
const Promise = require('bluebird');
const Joi = require('joi');
const Filter = require('./filter');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.number().integer()).required(),
  _source: Joi.alternatives().try(null, Joi.string(), Joi.number().integer()).required(),
  _target: Joi.alternatives().try(null, Joi.string(), Joi.number().integer()).required(),
  _partition: Joi.alternatives().try(null, Joi.number().integer()).required(),
  _label: Joi.string().required(),
  _prop: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The edge data structure class */
class Edge extends Component {
  /**
   * Create a Edge object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param, 'e', param.graph);

    // /* validate parameters */
    // this._validateParams(param, 'source');
    // this._validateParams(param, 'target');

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

  _validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  _validateParams(param = {}, endpoint) {

    // /* Validating source */
    // if (param[endpoint] && param[endpoint] instanceof Vertex) {
    //   /* if the id is null, add reference */
    //   if (param[endpoint].getId() == null) {
    //     param[endpoint] = param[endpoint].getRef();
    //   } else {
    //     param[endpoint] = param[endpoint].getId();
    //   }
    // } else if (param[endpoint] !== null && !Number.isInteger(param[endpoint])) {
    //   throw new Error('Edge ' + endpoint + ' must be integer or null, value:', param[endpoint]);
    // }
  }

  /*********************** GETTERS ***********************/

  getSource() {
    return this._source;
  }

  getTarget() {
    return this._target;
  }

  getPartition() {
    return this._partition;
  }

  /*********************** SETTERS ***********************/
  setSource(value) {
    this._source = value;
  }

  setTarget(value) {
    this._target = value;
  }

  setPartition(value) {
    this._partition = value;
  }

  /*********************** Operations ******************************/

  /**
   * Filter
   * @return {Filter}
   */
  filter() {
    return new Filter();
  }

  /*********************** REMOTE OPERATIONS ***********************/
  /**
   * Fetch both vertices attached to this edge.
   * @return {Promise} - Promise with the two vertices.
   */
  vertices() {

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_vertices';

    if (!this.getId()) {
      /* Error if id is not present */
      throw new Error('Edge id is required, set this edge instance id or load edge.', this);
    }
    if (!this.__parentGraph.getLabel()) {
      /* Error if id is not present */
      throw new Error('Graph label is required, set this graph instance label or load graph.', this.__parentGraph);
    }

    /* building the message */
    let msg = Message.buildMessage({
      payload: {
        graph: this.__parentGraph.getLabel(),
        id: this.getId()
      }
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[vertices]: ', apiFunc, JSON.stringify(msg));
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {

        /* setting properties */
        msg.source.graph = self.__parentGraph;
        msg.target.graph = self.__parentGraph;
        msg.source.debug = self.__debug;
        msg.target.debug = self.__debug;
        /* creating vertices */
        msg.source = new Vertex(msg.source);
        msg.target = new Vertex(msg.target);

        /* returning values */
        resolve(msg);

      }, (err)=> {
        reject(err);
      });
    });
  }

  // _validateCmp(cmp) {
  //   if (!(/v|V|e|E/g).test(cmp)) {
  //     throw new Error("Component must be one of the following: 'v','V', 'e','E', provided value:", cmp);
  //   }
  // }

}

/* exporting the module */
module.exports = Edge;