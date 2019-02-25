
module.exports = (pageId, lang, modules, arc) => {

	return new Promise((resolve, reject) => {
		
		try {

			arc.utils.getTreeModel(arc).findById(pageId, function (pageErr, pageDoc) {
				if (pageErr) {
					return arc.log('error', pageErr);
					return reject();
				}



				pageDoc.pageDataCode = JSON.stringify(modules.map(item => {
					return {
						"moduleName":item._listName,
						"itemIds":[item._id]
					}
				}));

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
			arc.log('error', `Error trying to update ${itemId}`);
			reject();
		}
  	});
};