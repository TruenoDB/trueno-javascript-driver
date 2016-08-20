"use strict";

/**
 * @author Victor O. Santos Uceta
 * Vertex class data structure.
 * @module lib/core/data_structures/vertex
 * @see module:core/api/external-api
 */

/* class modules */
const Message = require('../communication/message');
const Component = require('./component');
const Joi = require('joi');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.number().integer()).required(),
  _partition: Joi.alternatives().try(null, Joi.number().integer()).required(),
  _label: Joi.string().required(),
  _properties: Joi.object().required(),
  _computed: Joi.object().required(),
  _meta: Joi.object().required()
});

/** The edge data structure class */
class Vertex extends Component {
  /**
   * Create a Vertex object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param, 'v', param.graph);

    /* The partition where the vertex resides */
    this._partition = param.partition || null;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  _validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  /*********************** GETTERS AND SETTERS ***********************/

  getPartition() {
    return this._partition;
  }

  setPartition(value) {
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
  in(cmp, ftr) {
    return this._neighbors(cmp, ftr, 'in');
  }

  /**
   * Retrieve outgoing vertices or edges from the remote database, if no
   * filter is supplied, all vertices or edges will be retrieved(NOT RECOMMENDED).
   * @param {string} cmp - The component type, can be 'v','V', 'e','E'
   * @param {Filter} [ftr] - The filter to be applied.
   * @return {Promise} - Promise with the outgoing component results.
   */
  out(cmp, ftr) {
    return this._neighbors(cmp, ftr, 'out');
  }

  /**
   * Retrieve outgoing vertices or edges from the remote database(helper function)
   * @param {string} cmp - The component type, can be 'v','V', 'e','E'
   * @param {Filter} [ftr] - The filter to be applied.
   * @return {Promise} - Promise with the outgoing component results.
   */
  _neighbors(cmp, ftr, dir) {

    /* Validate the component */
    this._validateCmp(cmp);

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_neighbors';

    if (!this.getId()) {
      /* Error if id is not present */
      throw new Error('Vertex id is required ', this);
    }
    if (!this.__parentGraph.getId()) {
      /* Error if id is not present */
      throw new Error('Graph id is required ', this.__parentGraph);
    }

    /* Extracting filters if provided */
    if (ftr) {
      ftr = ftr.getFilters();
    }

    /* building the message */
    let msg = Message.buildMessage({
      payload: {
        graph: this.__parentGraph.getId(),
        id: this.getId(),
        dir: dir,
        cmp: cmp.toLowerCase(),
        ftr: ftr
      }
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[out]: ', apiFunc, msg);
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
   * Retrieve incoming degree with respect to vertices or edges from the remote database, if no
   * filter is supplied, the edge and vertex degree will be the same.
   * @param {string} cmp - The component type, can be 'v','V', 'e','E'
   * @param {Filter} [ftr] - The filter to be applied.
   * @return {Promise} - Promise with the in degree results.
   */
  inDegree(cmp, ftr) {
    return this._degree(cmp, ftr, 'in');
  }

  /**
   * Retrieve outgoing degree with respect to vertices or edges from the remote database, if no
   * filter is supplied, the edge and vertex degree will be the same.
   * @param {string} cmp - The component type, can be 'v','V', 'e','E'
   * @param {Filter} [ftr] - The filter to be applied.
   * @return {Promise} - Promise with the out degree results.
   */
  outDegree(cmp, ftr) {
    return this._degree(cmp, ftr, 'out');
  }

  /**
   * Retrieve {in|out} degree with respect to vertices or edges from the remote database(helper function).
   * @param {string} cmp - The component type, can be 'v','V', 'e','E'
   * @param {Filter} [ftr] - The filter to be applied.
   * @return {Promise} - Promise with the out degree results.
   */
  _degree(cmp, ftr, dir) {

    /* Validate the component */
    this._validateCmp(cmp);

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_degree';

    if (!this.getId()) {
      /* Error if id is not present */
      throw new Error('Vertex id is required ', this);
    }
    if (!this.__parentGraph.getId()) {
      /* Error if id is not present */
      throw new Error('Graph id is required ', this.__parentGraph);
    }

    /* Extracting filters if provided */
    if (ftr) {
      ftr = ftr.getFilters();
    }

    /* building the message */
    let msg = Message.buildMessage({
      payload: {
        graph: this.__parentGraph.getId(),
        id: this.getId(),
        dir: dir,
        cmp: cmp.toLowerCase(),
        ftr: ftr
      }
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[' + dir + 'Degree]: ', apiFunc, msg);
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

  _validateCmp(cmp) {
    if (!(/v|V|e|E/g).test(cmp)) {
      throw new Error("Component must be one of the following: 'v','V', 'e','E', provided value:", cmp);
    }
  }

}


/* exporting the module */
module.exports = Vertex;