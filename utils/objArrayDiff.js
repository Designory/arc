const objectDifference = require('./objectDiff');

module.exports = (arr1, arr2, key = '_id') => {
   return objectDifference(_.keyBy([...arr1], key), _.keyBy([...arr2], key));
};