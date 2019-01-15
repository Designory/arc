module.exports = (modules, id) => {

	const isString = (typeof modules === 'string') ? true : false;

 	modules = (isString) ? JSON.parse(modules) : modules;

  	const updatedModules = [...modules].filter((module) => {	
		if (module._id && module._id === id) return false;
		if (module.itemIds && module.itemIds[0] === id) return false;
		return true;
  	});
  	
  	return (isString) ? JSON.stringify(updatedModules) : updatedModules;

};