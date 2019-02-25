module.exports = (modules, config = {stringify:false, reduceForDb:false}) => {
   
   const itemData = (item.data && item.data[0]) ? item.data[0] : {};

   const newModules = [...modules].map(item => {
      	
  		return {
  			data:[(config.reduceForDb) ? item._id : item],
  			listName:item._listName
  		}

   });

   return (config.stringify) ? JSON.stringify(newModules) : newModules;

};