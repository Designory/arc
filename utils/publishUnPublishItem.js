//
//if listname is null, we default to the page model itself, otherwise, we use provided list name
module.exports = ({listName, _id, publish, lang}, arc) => {

	return new Promise((resolve, reject) => {
		
		try {

			const model = (!listName) ? arc.utils.getTreeModel(arc, lang) : arc.list(arc.keystonePublish.getList(listName)).model;

			model.findById(_id, function (pageErr, pageDoc) {
				if (pageErr) {
					return arc.log('error', pageErr);
					return reject();
				}

				if (!pageDoc) {
					return arc.log('error', `No items returns for ${arc.keystonePublish.getList(listName)} ${_id}`);
					return reject();
				}

				if (publish) pageDoc.publishToProduction = true;
				else pageDoc.unpublishProduction = true;

				pageDoc.save(function(saveErr, pageDoc) {
					
					if (saveErr) {
						return arc.log('error', saveErr);
						return reject();
					}
					
					arc.log(`Finished saving new page ${pageDoc._id} modules}`);
					resolve();

				});
			});

		} catch(err) {
			arc.log('error', `Error trying to update ${_id} in ${listName || (lang) ? lang : '' + ' tree model'}`);
			arc.log('error', err);
			reject();
		}
  	});
};