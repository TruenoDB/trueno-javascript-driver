"use strict";

/**
 * @author Your Name Goes Here
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

/** Description of the class */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = (function () {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */

  function Vertex() {
    var param = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Vertex);

    this._property = param.prop || 'someValue';
  }

  /* exporting the module */

  /**
   * Class function description.
   * @param {string} myParam - A string to be asignned asynchronously after 1 second.
   * @return {boolean} A true hardcoded value.
   */

  _createClass(Vertex, [{
    key: "myfunction",
    value: function myfunction(myParam) {

      /* This instance object reference */
      var self = this;

      /* some async execution */
      setTimeout(function () {
        self._property = myParam;
      }, 1000);

      return true;
    }
  }]);

  return Vertex;
})();

module.exports = Vertex;