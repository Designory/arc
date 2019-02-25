module.exports = (modules, config = {hashify:false}) => {
   
   const newModules = [...modules].map(item => {

      const itemData = (item.data && item.data[0]) ? item.data[0] : {};

      return Object.assign({}, itemData, {_listName:item.listName || item.moduleName})

   });

   if (config.hashify) {

      newModulesObj = {};

      newModules.forEach(item => {
          newModulesObj[item._id] = item;
      });

      return newModulesObj;

   } else {
      
      return newModules;
   
   }

};