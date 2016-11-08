"use strict";

/**
 * @author Servio Palacios
 * Random graph class data structure.
 * @module lib/core/data_structures/random_graph
 * @see module:core/api/external-api
 */

/** The compute data structure class */
class RandomGraph{
  /**
   * Create a Compute object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The relationship label */
    this._label = param.label || null;

    /* Object Seal No-Jutsu ~(X)~ */
    Object.seal(this);
  }

  _validateParams(param = {}, endpoint) {

  }

  /*********************** GETTERS ***********************/
  getParameters() {
    return this._parameters;
  }

  /*********************** SETTERS ***********************/

  setParameters(value) {
    this._parameters = value;
  }

  /**
   * Erdős–Rényi aka Gilbert
   *
   * @memberof randomgraph.ErdosRenyi
   * @param {Number} n number of nodes
   * @param {Number} p probability of a edge between any two nodes
   */
  generateErdosRenyi(n, p) {
    var graph = { nodes: [], edges: [] }, i, j;
    for (i = 0; i < n; i++) {
      graph.nodes.push({ id: i, label: 'node '+i });
      for (j = 0; j < i; j++) {
        if (Math.random() < p) {
          graph.edges.push({
            source: i,
            target: j
          });
        }
      }//for
    }//for
    return graph;
  }//generateErdosRenyi

}//class

/* exporting the module */
module.exports = RandomGraph;
