const defaultConfig = {
	consolidateModules: false,
	decode: false,
	hashify: false,
	select: null,
	onRender: null,
	lean: null,
	customQuery: null,
	populate: null,
	archive: null
};

module.exports = async (arc, pageModules, reqConfig) => {


	reqConfig = Object.assign({}, defaultConfig, reqConfig);

	return new Promise(async (resolve, reject) => {
		
		try {		
			
			// first, default comes from the db as a string
			if (typeof pageModules === 'string') pageModules = JSON.parse(pageModules);

			// consolidate list items if needed/required
			if (reqConfig.consolidateModules) pageModules = consolidateModules(pageModules);

	  		const promises = pageModules.map(item => {
	  			return populateModule(item);
	  		});	

			const modules = await Promise.all(promises.map(p => p.catch(e => e)));

			if (reqConfig.consolidateModules){
				return resolve(modules)
			} else {
				return resolve(arc.utils.decodeModuleList(modules, {decode:reqConfig.decode, hashify:reqConfig.hashify}));
			}

  			// return Promise.all(promises).then(function(modules) {

			// 	if (reqConfig.consolidateModules){
			// 		return resolve(modules)
			// 	} else {
			// 		return resolve(arc.utils.decodeModuleList(modules, {decode:reqConfig.decode, hashify:reqConfig.hashify}));
			// 	}

    		// }).catch(function(err) {
      		// 	arc.log('error', err);
      		// 	resolve([]);
    		// });

		} catch(err) {
			arc.log('error', err);
		}

  	});

	async function populateModule(item) {

		return new Promise(async (resolve, reject) => {

			//return resolve();

			const modelConfig = arc.getModels(item.moduleName);

			if (!modelConfig) {
				arc.log('error', 'Cannot get models for a module. Be sure that all models are registered with `Arc.register(...)`');
				return resolve();
			}			 

			try {

				// get the item configuration
				const itemConfig = Object.assign(reqConfig, modelConfig);

				// bail if item item is archived (TODO: revist this approach)
				if (itemConfig.archive) resolve(null);			

				// get list
				const itemQuery = arc.list(arc.keystonePublish.getList(item.moduleName)).model.find({_id: {$in:item.itemIds}}).lean();

				// uses Mongoose custom schema
				if (itemConfig.populate) itemQuery.arcPopulate();
				
				// catchall, enable completely custom queries
				if (itemConfig.customQuery) itemQuery = itemConfig.customQuery(itemConfig.customQuery);
				
				// custom select
				if (itemConfig.select) itemQuery.select(itemConfig.select);

				// custom select
				if (itemConfig.lean) itemQuery.lean();

				itemQuery.exec((err, results) => {

					if (err) {
						arc.log('error', err);
						return reject('Issue querying results.');
					}
					
					if (!results) {
						arc.log('error', 'No database results querying for building site tree.');
						return reject('Cannot find the site tree.');
					}	

					results = orderResults(results, item.itemIds);
					console.log(itemConfig.onRender, itemConfig.listName);
					if (itemConfig.onRender) {

						return itemConfig.onRender(results, arc.keystonePublish.getList(item.moduleName), data => {
							
							return resolve({moduleName:item.moduleName, data:data});
						});
						
					} else {

						return resolve({moduleName:item.moduleName, data:results});
					}

				});

			} catch(err) {
				arc.log('error', err);
				return reject(err);
			}	

		});
	}

	// thank you Constantin!!!
	// https://codepen.io/pojoga84/pen/MPJKRq?editors=0010
	function consolidateModules(arr = []) {
		if (arr.length < 1) return false;
		let res = [arr[0]];
  
		for (let i = 1; i < arr.length; i++) {
 			if (arr[i].moduleName === res[res.length - 1].moduleName) {
 				res[res.length - 1].itemIds.push(arr[i].itemIds[0]);
    		} else {
      			res.push(arr[i]);
    		}
  		}
  		
  		return res;
	}

	function orderResults(results, idList) {
		return idList.map(id => {
			return results.filter(data => {
				return data._id.toString() === id;
			})[0];
		});
	}

};