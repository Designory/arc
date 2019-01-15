// from https://stackoverflow.com/questions/21987909/how-to-get-the-difference-between-two-arrays-of-objects-in-javascript
module.exports = (oldArr, newArr) => {

   function comparer(otherArray){
     return function(current){
       return otherArray.filter(function(other){
         return other.sortOrder == current.sortOrder && 
            other.indentLevel == current.indentLevel &&
            other.url == current.url
       }).length == 0;
     }
   }

   var onlyInA = oldArr.filter(comparer(newArr));
   var onlyInB = newArr.filter(comparer(oldArr));

   return onlyInA.concat(onlyInB);

};