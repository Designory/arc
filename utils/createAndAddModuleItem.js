
module.exports = (pageId, listName, updateData, arc) => {

	let duplicateId = updateData._id || false;

	if (duplicateId) {
		delete updateData._id;
	}

	return new Promise((resolve, reject) => {
		
		try {

			const model = arc.list(arc.keystonePublish.getList(listName)).model;
			//const properUrl = item.properUrl || 

			model.create(updateData, function (moduleErr, moduleDoc) {
				if (moduleErr) {
					return arc.log('error', moduleErr);
					return reject();
				}
				arc.log(`Finished saving new ${listName} ${moduleDoc._id}`);

				arc.utils.getTreeModel(arc).findById(pageId, function (pageErr, pageDoc) {
					if (pageErr) {
						return arc.log('error', pageErr);
						return reject();
					}

					const pageDataCode = JSON.parse(pageDoc.pageDataCode || '[]')
					
					if (!duplicateId) {
						pageDataCode.push({
							"moduleName":listName,
							"itemIds":[moduleDoc._id]
						});
					
					} else {

						const index = pageDataCode.findIndex(module => module.itemIds[0] === duplicateId);
						
						pageDataCode.splice(index, 0, {
							"moduleName":listName,
							"itemIds":[moduleDoc._id]
						});

					}

					pageDoc.pageDataCode = JSON.stringify(pageDataCode);
					pageDoc.save(function (saveErr, pageDoc) {
						
						if (saveErr) {
							return arc.log('error', saveErr);
							return reject();
						}

						arc.log(`Finished saving new page ${pageDoc._id} with ${listName} ${moduleDoc._id}`);
						resolve();
					});
				});

			});

		} catch(err) {
			arc.log('error', `Error trying to update ${itemId}`);
			reject();
		}
  	});
};