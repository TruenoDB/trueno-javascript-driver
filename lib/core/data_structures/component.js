"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph component super class.
 * @module lib/core/data_structures/component
 * @see module:core/data_structure/graph
 */

/* class modules */
const Message = require('../communication/message');
const Promise = require('bluebird');
const uuid = require('node-uuid');
//const Joi = require('joi');

/** Graph component super class */
class Component {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   * @param {string} type - The component type.
   */
  constructor(param = {}, type, g) {

    /* This component type */
    this.__type = type;
    /* This component parent graph, if null, this is the graph itself */
    this.__parentGraph = g || this;
    /* debug flag */
    this.__debug = param.debug;

    /* The internal id of the component */
    this._id = param.id || null;
    /* The internal jobId of the component */
    this._jobId = param.jobId || null;
    /* The component label */
    this._label = param.label || null;
    /* Component custom properties */
    this._prop = param.prop || {};
    /* Component custom computed fields */
    this._comp = param.computed || {};
    /* Component metadata */
    this._meta = param.meta || {};
  }

  /**
   * Validates the Graph object schema.
   * @return {promise} A promise for the validation result.
   */
  static validate(c, schema) {
    /* return validation promise */
    return new Promise((resolve, reject)=> {
      // Joi.validate(c, schema, {abortEarly: false}, (err, value)=> {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(value);
      //   }
      // });
    });
  }

  /*======================== GETTERS & SETTERS =======================*/

  getId() {
    return this._id;
  }

  setId(value) {
    this._id = value;
  }

  setJobId(value) {
    this._jobId = value;
  }

  getRef() {
    return this.__ref;
  }

  isDirty() {
    return this._isDirty;
  }

  getLabel() {
    return this._label;
  }

  setLabel(value) {
    this._label = value;
  }

  /*=========================== PROPERTIES ===========================*/

  properties() {
    return Object.freeze(this._prop);
  }

  /* Properties collection methods */
  setProperty(prop, value) {

    /* validating the prop type */
    this._validatePropAndVal(prop, value);
    /* Adding the property */
    this._prop[prop] = value;
  }

  getProperty(prop) {
    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* getting the property */
    return this._prop[prop]
  }

  removeProperty(prop) {

    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* Removing the property */
    delete this._prop[prop];
  }

  /*============================ COMPUTED ============================*/

  computed() {
    return Object.freeze(this._comp);
  }


  /* Computed collection methods */
  setComputed(algo, prop, value) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the prop type */
    this._validatePropAndVal(prop, value);
    /* if algo property does not exist, create it */
    if (!this._comp[algo]) {
      this._comp[algo] = {};
    }
    /* Adding the property */
    this._comp[algo][prop] = value;

  }

  getComputed(algo, prop) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* if algo property does not exist */
    if (!this._comp[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is not present');
    }
    if (!this._comp[algo][prop]) {
      throw new Error('Provided algorithm property(' + prop + ') is not present');
    }

    /* Getting the property */
    return this._comp[algo][prop];

  }

  removeComputed(algo, prop) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* if algo property does not exist */
    if (!this._comp[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is not present');
    }
    if (!this._comp[algo][prop]) {
      throw new Error('Provided algorithm property(' + prop + ') is not present');
    }
    /* removing the property */
    delete this._comp[algo][prop];
  }

  /*============================== META ==============================*/

  meta() {
    return Object.freeze(this._meta);
  }

  getMeta(prop) {

    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* Getting the property */
    return Object.freeze(this._meta[prop]);
  }

  /*=========================== VALIDATION ===========================*/

  /* Validation methods */
  _validateAlgoType(algo) {
    if (!/^string$/.test(typeof algo)) {
      throw new Error('Algorithm name must be of type: string');
    }
  }

  _validatePropAndVal(prop, value) {

    /* validating the prop type */
    if (!/^string$/.test(typeof prop)) {
      throw new Error('Property name must be of type: string');
    }
    /* validating the value type */
    if (!/^(boolean|number|string)$/.test(typeof value) && !(value instanceof Date) && !(value instanceof Array) && !(value instanceof Object)) {
      throw new Error('Property value must be of type: boolean | number | string | Date| Array| Object');
    }
  }

  _validateGraphLabel() {
    /* If label is not present throw error */
    if (!this.__parentGraph.getLabel()) {
      throw new Error('Graph label is required');
    }

    /* If label is not present throw error */
    if (this.__type == 'g') {
      this.setId(this.getLabel());
    }
  }

  /*======================== REMOTE OPERATIONS =======================*/

  /**
   * Persist the component changes in the remote database.
   */
  persist() {
    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_persist';

    /* validate that graph label is present */
    this._validateGraphLabel();

    /* validate edge source and target */
    if (this.__type == 'e' && (!this.getSource() || !this.getTarget())) {
      throw new Error('Edge source and target are required');
    }

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
        graph: this.__parentGraph.getLabel(),
        type: this.__type,
        obj: obj
      }
    });

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[persist]: ', apiFunc, JSON.stringify(msg));
    }

    /* if bulk area is open, push and return */
    if (this.__parentGraph.__isBulkOpen) {
      this.__parentGraph.pushOperation(apiFunc, msg._payload);
      return;
    }
    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        console.log('self.setId ======> ', msg[1]);
        /* set incoming id */
        self.setId(msg[1]._id);
        resolve(msg[1]._id);
      }, (error)=> {
        reject(error);
      });
    });
  }//persist

  /**
   * Destroy component(s) at the remote database.
   * @param {string} [cmp] - The component type, can be 'v','V', 'e','E', 'g', or 'G'
   * @param {Filter} [ftr] - The filter to be applied
   */
  destroy(cmp, ftr) {

    /* This instance object reference */
    let self = this;
    const apiFunc = 'ex_destroy';

    /* The message reference */
    let msg;

    /* validate that graph label is present */
    this._validateGraphLabel();

    /* Extracting filters if provided */
    if (ftr) {
      ftr = ftr.getFilters();
    }

    /* deciding which component to destroy */
    if (this.__type == 'g' && cmp) {
      /* validating component */
      this._validateCmp(cmp);
      /* building message */
      msg = Message.buildMessage({
        payload: {
          graph: this.getLabel(),
          type: cmp.toLowerCase(),
          ftr: ftr
        }
      });
    } else if (this.getId()) {
      /* building message */
      msg = Message.buildMessage({
        payload: {
          graph: this.__parentGraph.getLabel(),
          type: this.__type,
          obj: {id: this.getId()}
        }
      });
    } else {
      /* Error if id is not present */
      throw new Error('Component id is required ', this);
    }

    /* if debug display operation params */
    if (this.__debug) {
      console.log('DEBUG[destroy]: ', apiFunc, JSON.stringify(msg));
    }

    /* if bulk area is open, push and return */
    if (this.__parentGraph.__isBulkOpen) {
      this.__parentGraph.pushOperation(apiFunc, msg._payload);
      return;
    }

    /* return promise with the async operation */
    return new Promise((resolve, reject)=> {
      self.__parentGraph.__conn._rpc.call(apiFunc, msg).then((msg)=> {
        resolve(msg);
      }, (err)=> {
        reject(err);
      });
    });
  }//destroy

  /**
   * Validate component.
   * @param {string} [cmp] - The component type, can be 'v','V', 'e','E', 'g', or 'G'
   */
  _validateCmp(cmp) {
    if (!(/v|V|c|C|e|E|g|G/g).test(cmp)) {
      throw new Error("Component must be one of the following: 'g', 'G', v','V', 'e','E', provided value:", cmp);
    }
  }//validateCmp

}

/* exporting the module */
module.exports = Component;
