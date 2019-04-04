
module.exports = (arc, 	updateData, config) => {

	config = Object.assign({
		lang:null,
		stopPostSaveHook:true
	}, config);

	return new Promise((resolve, reject) => {
		
		try {

			const treeModel = arc.utils.getTreeModel(arc, config.lang);

			updateData.stopPostSaveHook = config.stopPostSaveHook;

			treeModel.create(updateData, function (pageErr, pageDoc) {
				if (pageErr) {
					return arc.log('error', pageErr);
					return reject();
				}

				resolve(pageDoc._doc);

			});

		} catch(err) {
			arc.log('error', `Error trying to update ${updateData.name}`);
			arc.log('error', err);
			reject();
		}
  	});
};