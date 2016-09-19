"use strict";

/**
 * @author Servio Palacios
 * Compute class data structure.
 * @module lib/core/data_structures/compute
 * @see module:core/api/external-api
 */

/* class modules */
const Message = require('../communication/message');
const Component = require('./component');
const Vertex = require('./vertex');
const Promise = require('bluebird');
const Filter = require('./filter');

/** The compute data structure class */
class Compute extends Component {
  /**
   * Create a Compute object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* invoke super constructor */
    super(param, 'c', param.graph);

    /* The algorithm */
    this._algorithm = param.algorithm || null;
    /* The Parameters */
    this._parameters = param.parameters || null;
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

  }

  /*********************** GETTERS ***********************/
  getParameters() {
    return this._parameters;
  }

  getAlgorithm() {
    return this._algorithm;
  }

  /*********************** SETTERS ***********************/
  setAlgorithm(value) {
    this._algorithm = value;
  }

  setParameters(value) {
    this._parameter = value;
  }

  /*********************** REMOTE OPERATIONS ***********************/
  /**
   * Deploy the algorithm in the Spark Cluster - using Spark Job Server
   * @return {Promise} - Promise with the jobId.
   */
  deploy() {
    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_compute';

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
        graph:         self.getLabel(),
        algorithmType: self._algorithm,
        subgraph:      'schema'
      }
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[compute]: ', apiFunc, JSON.stringify(msg));
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        /* set incoming jobId */
        console.log(msg);
        self.setId(msg._jobId);
        resolve(msg._jobId);
      }, (error)=> {
        reject(error);
      });
    });
  }//compute

   /**
   * Request Status of deployed job - using Spark Job Server
   * @jobId {String}   -> Deployed jobId 
   * @return {Promise} -> Promise with the jobId.
   */
  jobStatus(jobId) {
    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_computeJobStatus';

    /* validate that graph label is present */
    self._validateGraphLabel();

    /* Build this object properties */
    let obj = {};
    Object.keys(this).map((k)=> {
      if (!k.includes('__')) {
        obj[k.substring(1)] = self[k];
      }
    });

    /* building the message */
    let msg = Message.buildMessage({
      payload: {jobId: jobId}
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[computeJobStatus]: ', apiFunc, JSON.stringify(msg));
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        /* set incoming jobId */
        console.log(msg);
        self.setId(msg.status);
        resolve(msg.status);
      }, (error)=> {
        reject(error);
      });
    });
  }//compute

}

/* exporting the module */
module.exports = Compute;
