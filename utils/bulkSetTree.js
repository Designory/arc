// returns array of items that don't already exist

module.exports = async (arc, treeItems, lang) => {

	return new Promise(async (resolve, reject) => {
		
		let promises = [];

		try {		

			if (Array.isArray(treeItems)) {

				promises = treeItems.map(item => {
		  			return arc.utils.updateTreeItem(item._id, item, arc, lang);
		  		});

			} else {

				for (let key in treeItems) {

					promises.push(arc.utils.updateTreeItem(key, treeItems[key], arc, lang));
				}
			}
	  		

  			Promise.all(promises).then(function(modules) {
      			resolve(modules.filter(item => {
      				return item && item !== 'undefined' && item._id !== 'undefined';  
      			}));
    		}).catch(function(err) {
      			arc.log('error', err);
      			resolve(null);
    		});

		} catch(err) {
			arc.log('error', err);
		}

  	});
};