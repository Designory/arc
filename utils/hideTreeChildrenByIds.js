module.exports = (tree, ids) => {
   
   let lastIndentLevel = false;

   return tree.filter(item => {

      const currentIndentLevel = parseInt(item.indentLevel);

      if (ids.includes(item._id)) {
         if (lastIndentLevel === false || lastIndentLevel >= currentIndentLevel) {
            lastIndentLevel = currentIndentLevel;
            return true;
         }         
      }

      if (!lastIndentLevel) return true;   

      if (lastIndentLevel < currentIndentLevel) return false;

      if (lastIndentLevel >= currentIndentLevel) {
         lastIndentLevel = false;
         return true;
      }

   });

};