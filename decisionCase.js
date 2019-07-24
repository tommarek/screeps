'use strict';

/**
 * Represents a predicate and corresponding action to take if predicate is a
 * match.
 * @param {bool|func} predicate
 *   true or Function( object ) returning a boolean.
 * @param {func|DecisionCase|Array} action
 *   One of Function, DecisionCase, Array of DecisionCases or other value (see
 *   DecisionCase.evaluate as to how each is applied)
 * @param {func} preHook
 *   Pre decision hook to be run before the evaluation process
 */
DecisionCase = function(predicate, action, preHook=undefined) {
  this.predicate = predicate;
  this.action = action;
  this.preHook = preHook;
};


DecisionCase.prototype.nomatch = {
  match: false
};

DecisionCase.prototype.match = (v) => {
  return {
    match: true,
    result: v
  }
};
/**
 * Recursively test Cases and applies corresponding action on object
 * The action applied depends on the datatype of `action`:
 *   - Function: evaluates to action(object)
 *   - DecisionCase: A subsequent test is performed Evaluates to whatever the
 *                   DecisionCase action evaluates to
 *   - Array of DecisionCases: Subsequent tests are performed. Evaluates to
 *                             whatever the action of the first matching DecisionCase
 *                             evaluates to
 *   - Any other value: evaluates to itself
 * @param {object} object
 *   object according to which we want to make actions ased on DecisionCases
 * @returns {match: boolean, result: object}
 *   match indicates if DecisionCase was a match, result contains result of applied action
 */
DecisionCase.prototype.evaluate: function(object) {
  // run preHook if defined
  if (this.preHook) this.preHook(object);

  var match = this.predicate;
  if (match instanceof Function)
    match = match(object);

  if (match) {

    if (this.action instanceof Function)
      return this.match(this.action(object));

    if (this.action instanceof DecisionCase)
      return this.action.evaluate(object);

    if (this.action instanceof Array) {
      var decision;
      var result;
      for (var c = 0; c < this.action.length; c++) {
        decision = this.action[c];
        if (decision instanceof DecisionCase) {
          result = decision.evaluate(object);
          if (result.match)
            return result;
        } else {
          throw ("Array of DecisionCase expected");
        }
      }

      return this.nomatch;
    }

    return this.match(this.action);
  }
  return this.nomatch;
};
