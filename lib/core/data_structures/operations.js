"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database Operations class.
 * @module lib/core/data_structures/operations
 */


/** The edge data structure class */
class Operations {
  /**
   * Create a Edge object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    this._operations = {};

  }

  /**
   * Persist Graph on remote trueno database, if has id it will be updated, if not will
   * be created.
   * @param {Graph} g - The Graph to be created.
   * @return {promise} The operation result promise.
   */
  persistGraph(g) {

    /* if this list of operation does not exist, create
     * property and array collection.
     */
    if (!this._operations.persistGraph) {
      this._operations.persistGraph = [];
    }
    /* adding component to the list */
    this._operations.persistGraph.push(g);
  }

  /**
   * Delete Graph on remote trueno database, id is required.
   * @param {Graph} g - The Graph to be deleted.
   * @return {promise} The operation result promise.
   */
  deleteGraph(g) {

    /* if this list of operation does not exist, create
     * property and array collection.
     */
    if (!this._operations.deleteGraph) {
      this._operations.deleteGraph = [];
    }
    /* adding component to the list */
    this._operations.deleteGraph.push(g);
  }


  /**
   * Get Graph list from remote trueno database.
   * @param {Graph} g - The graph to be requested, fields will be used
   * as filters. Filtered Graphs will be returned in a array collection.
   */
  _getGraphList(g) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(g, Graph);

    /* return promise with the async operation */
    return this._rpc.call('ex_getGraphList', g);
  }

  /********************************* VERTEX EXTERNAL API METHODS *********************************/

  /**
   * Create Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be created.
   */
  _createVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_createVertex', v);
  }

  /**
   * Update Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be updated.
   */
  _updateVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateVertex', v);
  }

  /**
   * Delete Vertex on remote trueno database.
   * @param {Vertex} v - The Vertex to be delete.
   */
  _deleteVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteVertex', v);
  }

  /**
   * Get Vertex from remote trueno database.
   * @param {Vertex} v - The Vertex to be requested.
   */
  _getVertex(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_getVertex', v);
  }

  /**
   * Get Vertex list from remote trueno database.
   * @param {Vertex} v - The Vertex to be requested, fields will be used
   * as filters. Filtered vertices will be returned in a array collection.
   */
  _getVertexList(v) {

    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(v, Vertex);

    /* return promise with the async operation */
    return this._rpc.call('ex_getVertexList', v);
  }

  /********************************* EDGE EXTERNAL API METHODS *********************************/

  /**
   * Create Edge on remote trueno database.
   * @param {Edge} e - The Edge to be created.
   */
  _createEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_createEdge', e);
  }

  /**
   * Update Edge on remote trueno database.
   * @param {Edge} e - The Edge to be updated.
   */
  _updateEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_updateEdge', e);
  }

  /**
   * Delete Edge on remote trueno database.
   * @param {Edge} e - The Edge to be delete.
   */
  _deleteEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_deleteEdge', e);
  }

  /**
   * Get Edge from remote trueno database.
   * @param {Edge} e - The Edge to be requested.
   */
  _getEdge(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_getEdge', e);
  }

  /**
   * Get Edge list from remote trueno database.
   * @param {Edge} e - The Edge to be requested, fields will be used
   * as filters. Filtered Edges will be returned in a array collection.
   */
  _getEdgeList(e) {
    /* This instance object reference */
    let self = this;

    /* validating connection */
    this._checkConnectionAndValidate(e, Edge);

    /* return promise with the async operation */
    return this._rpc.call('ex_getEdgeList', e);
  }

}


/* exporting the module */
module.exports = Edge;