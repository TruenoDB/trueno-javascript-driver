"use strict";

/**
 * @author Victor O. Santos Uceta
 * Edge class data structure.
 * @module lib/core/data_structures/edge
 * @see module:core/api/external-api
 */

/* class modules */
const Component = require('./component');
const Vertex = require('./vertex');
const Joi = require('joi');

/* validation schema constant */
const _schema = Joi.object().keys({
  _id: Joi.alternatives().try(null, Joi.number().integer()).required(),
  _source: Joi.alternatives().try(null, Joi.string(), Joi.number().integer()).required(),
  _target: Joi.alternatives().try(null, Joi.string(), Joi.number().integer()).required(),
  _partition: Joi.alternatives().try(null, Joi.number().integer()).required(),
  _label: Joi.string().required(),
  _properties: Joi.object().required(),
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

  _validate() {
    /* Validate this component with its schema */
    return Component.validate(this, _schema);
  }

  _validateParams(param = {}, endpoint) {

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

}


/* exporting the module */
module.exports = Edge;