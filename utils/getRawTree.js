module.exports = (arc, config = {lean:true, select:null, _id:null, sort:'sortOrder', query:null}) => {

	return new Promise((resolve, reject) => {

    	let query = arc.utils.getTreeModel(arc);

    	if (config._id) query = query.findById(config._id);
    	else query = query.find();
		
    	if (config.query) query = config.query(query);

		if (config.sort) query.sort('sortOrder');
			
		if (config.lean) query.lean();
		
		if (config.select) query.select(config.select);

		query.exec((err, results) => {
			
			if (err) {
				arc.log('error', err);
				return reject('Issue querying results.');
			}
			
			if (!results) {
				arc.log('error', 'No database results querying for building site tree.');
				return reject('Cannot find the site tree.');
			}		

			return resolve(results);

		});	
  	});
};