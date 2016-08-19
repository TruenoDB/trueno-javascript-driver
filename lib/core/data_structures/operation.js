"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database Operations class.
 * @module lib/core/data_structures/operations
 */


/** The Operation class*/
class Operation {
  /**
   * Create a Edge object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The operation to execute */
    this._op = param.op || null;
    /* The operation parameters */
    this._param = param.param || null;

  }
}


/* exporting the module */
module.exports = Operation;