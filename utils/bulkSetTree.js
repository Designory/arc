
module.exports = async (arc, treeItems) => {

	return new Promise(async (resolve, reject) => {
		
		let promises = [];

		try {		

			if (Array.isArray(treeItems)) {

				promises = treeItems.map(item => {
		  			return arc.utils.updateTreeItem(item._id, item, arc);
		  		});

			} else {

				for (let key in treeItems) {
					promises.push(arc.utils.updateTreeItem(key, treeItems[key], arc));
				}
			}
	  		

  			Promise.all(promises).then(function(modules) {
      			resolve(true);
    		}).catch(function(err) {
      			arc.log('error', err);
      			resolve(null);
    		});

		} catch(err) {
			arc.log('error', err);
		}

  	});
};