// reqConfig options
// 	{
// 		select,
// 		onRender,
// 		populate
// 	}
module.exports = async (arc, treeItems) => {

	return new Promise(async (resolve, reject) => {
		
		try {		

	  		const promises = treeItems.map(item => {
	  			return arc.utils.updateTreeItem(item._id, item, arc);
	  		});

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