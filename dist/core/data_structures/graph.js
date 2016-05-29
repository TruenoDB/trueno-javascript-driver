"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph class data structure.
 * @module lib/core/data_structures/graph
 * @see module:core/worker
 */

/** The graph data structure class */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = (function () {

  /**
   * Create a Graph object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Graph() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Graph);

    /* The internal id of the graph */
    this._id = null;
    /* The name of the graph */
    this._name = param.name;
    /* If true, graph is directed, if false is undirected(default) */
    this._directed = param.directed || false;
    /* True if the graph is dynamic, default static */
    this._dynamic = param.dynamic || false;
    /* True if the graph is a multigraph(parallel edges between same vertices */
    this._multi = param.multi || false;
    /* Graph custom attributes */
    this._attributes = param.attributes || {};
    /* Graph custom computed fields */
    this._computed = param.computed || {};
    /* Graph metadata */
    this._meta = param.meta || {};
  }

  /* exporting the module */

  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */

  _createClass(Graph, [{
    key: "myfunction",
    value: function myfunction(myParam) {}
  }]);

  return Graph;
})();

module.exports = Graph;