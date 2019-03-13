
module.exports = (arc, 	updateData, lang) => {

	return new Promise((resolve, reject) => {
		
		try {
			
			const treeModel = arc.utils.getTreeModel(arc, lang);

			treeModel.create(updateData, function (pageErr, pageDoc) {
				if (pageErr) {
					return arc.log('error', pageErr);
					return reject();
				}

				resolve(pageDoc._doc);

			});

		} catch(err) {
			arc.log('error', `Error trying to update ${updateData.name}`);
			reject();
		}
  	});
};