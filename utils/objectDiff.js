const _ = require('lodash');

// from https://gist.github.com/Yimiprod/7ee176597fef230d1451
/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
module.exports = (object, base) => {
   function changes(object, base) {
      return _.transform(object, function(result, value, key) {
         if (!_.isEqual(value, base[key])) {
            result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
         }
      });
   }
   return changes(object, base);
}