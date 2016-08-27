"use strict";

/**
 * @author Victor O. Santos Uceta
 * Database Search Filter class.
 * @module lib/core/data_structures/filter
 */


/** The Filter Chaining class*/
class Filter {
  /**
   * Create a Filter object instance.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {

    /* The to execute */
    this._filters = [];
    this._ftr = null;

  }

  /**
   * Returns an array of all filters.
   */
  getFilters() {
    return Object.freeze(this._filters);
  }

  /**
   * Clear stored filters.
   */
  clearFilters() {
    return this._filters = [];
  }

  /**
   * The term matching filter, can be either a exact string or number.
   * @param {string} prop - The property/meta/computed to be applied on the operation.
   * @param {string|number} val - The filter value.
   */
  term(prop, val) {
    this._filters.push({
      type: 'term',
      prop: prop,
      val: val,
      ftr: this._ftr || 'AND'
    });
    /* reset or filter */
    this._ftr = null;

    return this;
  }

  /**
   * The range filter.
   * @param {string} prop - The property/meta/computed to be applied on the operation.
   * @param {string} op - The inequality operator(gt,gte,lt,lte).
   * @param {number|date} val - The filter date or number value.
   */
  range(prop, op, val) {
    this._filters.push({
      type: 'range',
      prop: prop,
      op: op,
      val: val,
      ftr: this._ftr || 'AND'
    });
    /* reset or filter */
    this._ftr = null;

    return this;
  }

  /**
   * The exist check field filter.
   * @param {string} prop - The property/meta/computed to be applied on the operation.
   */
  exist(prop) {
    this._filters.push({
      type: 'exist',
      prop: prop,
      ftr: this._ftr || 'AND'
    });
    /* reset or filter */
    this._ftr = null;

    return this;
  }

  /**
   * The wildcard string search filter.
   * @param {string} prop - The property/meta/computed to be applied on the operation.
   * @param {string} val - The wildcard filter value.
   */
  wildcard(prop, val) {
    this._filters.push({
      type: 'wildcard',
      prop: prop,
      val: val,
      ftr: this._ftr || 'AND'
    });
    /* reset or filter */
    this._ftr = null;

    return this;
  }

  /**
   * The regexp string search filter.
   * @param {string} prop - The property/meta/computed to be applied on the operation.
   * @param {string} val - The filter regular expression value.
   */
  regexp(prop, val) {
    this._filters.push({
      type: 'regexp',
      prop: prop,
      val: val,
      ftr: this._ftr || 'AND'
    });
    /* reset or filter */
    this._ftr = null;

    return this;
  }

  /**
   * The prefix string search filter.
   * @param {string} prop - The property/meta/computed to be applied on the operation.
   * @param {string} val - The filter value.
   */
  prefix(prop, val) {
    this._filters.push({
      type: 'prefix',
      prop: prop,
      val: val,
      ftr: this._ftr || 'AND'
    });
    /* reset or filter */
    this._ftr = null;

    return this;
  }

  /**
   * Limit the results of this search.
   * @param {integer} val - The integer limit of for the results.
   */
  limit(val) {
    this._filters.push({
      type: 'size',
      val: val
    });
    return this;
  }

  /**
   * Chooses next filter with an OR operator.
   */
  or() {
    /* set OR filter to true */
    this._ftr = 'OR';
    return this;
  }

  /**
   * Chooses next filter with an NOT operator.
   */
  not() {
    /* set NOT filter*/
    this._ftr = 'NOT';
    return this;
  }

}

/* exporting the module */
module.exports = Filter;