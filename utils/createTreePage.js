
module.exports = (arc, 	updateData, config = {lang:null, stopPostSaveHook:true}) => {

	return new Promise((resolve, reject) => {
		
		try {
				
			console.log('config ---> ', config);

			const treeModel = arc.utils.getTreeModel(arc, config.lang);

			updateData.stopPostSaveHook = config.stopPostSaveHook;

			console.log(updateData);

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