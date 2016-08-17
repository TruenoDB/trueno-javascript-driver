"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph component super class.
 * @module lib/core/data_structures/component
 * @see module:core/data_structure/graph
 */

const Joi = require('joi');
const Promise = require("bluebird");

/** Graph component super class */
class Component {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The internal id of the component */
    this._id = param.id || null;
    /* Component custom properties */
    this._properties = param.properties || {};
    /* Component custom computed fields */
    this._computed = param.computed || {};
    /* Component metadata */
    this._meta = param.meta || {};
    /* is dirty flag */
    this._isDirty = true;
  }

  /**
   * Validates the Graph object schema.
   * @return {promise} A promise for the validation result.
   */
  static validate(c, schema) {
    /* return validation promise */
    return new Promise((resolve, reject)=> {
      Joi.validate(c, schema, {abortEarly: false}, (err, value)=> {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  /*********************** MISCELLANEOUS ***********************/
  getId() {
    return this._id;
  }

  setId(value) {
    this._id = value;
  }

  isDirty(){
    return this._isDirty;
  }

  /*********************** PROPERTIES ***********************/

  getProperties() {
    return Object.freeze(this._properties);
  }

  /* Properties collection methods */
  setProperty(prop, value) {

    /* validating the prop type */
    this._validatePropAndVal(prop, value);
    /* Adding the property */
    this._properties[prop] = value;
  }

  getProperty(prop) {
    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* getting the property */
    return this._properties[prop]
  }

  removeProperty(prop) {

    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* Removing the property */
    delete this._properties[prop];
  }

  /*********************** COMPUTED ***********************/

  getComputed() {
    return Object.freeze(this._computed);
  }


  /* Computed collection methods */
  setComputed(algo, prop, value) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the prop type */
    this._validatePropAndVal(prop, value);
    /* if algo property does not exist, create it */
    if (!this._computed[algo]) {
      this._computed[algo] = {};
    }
    /* Adding the property */
    this._computed[algo][prop] = value;

  }

  getComputed(algo, prop) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* if algo property does not exist */
    if (!this._computed[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is not present');
    }
    if (!this._computed[algo][prop]) {
      throw new Error('Provided algorithm property(' + prop + ') is not present');
    }

    /* Getting the property */
    return this._computed[algo][prop];

  }

  removeComputed(algo, prop) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* if algo property does not exist */
    if (!this._computed[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is not present');
    }
    if (!this._computed[algo][prop]) {
      throw new Error('Provided algorithm property(' + prop + ') is not present');
    }
    /* removing the property */
    delete this._computed[algo][prop];
  }

  /*********************** META ***********************/

  getMeta() {
    return Object.freeze(this._meta);
  }

  getMeta(prop) {

    /* validating the prop type */
    this._validatePropAndVal(prop, '');
    /* Getting the property */
    return Object.freeze(this._meta[prop]);
  }

  /*********************** VALIDATION ***********************/
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

}


/* exporting the module */
module.exports = Component;