const async = require('async');
const _ = require('lodash');

module.exports = async (arc, context) => {

	return new Promise(async (resolve, reject) => {
		
		console.log('buildUrls.js');

		try {

			// get all site tree documents
			const treeModel = arc.utils.getTreeModel(arc);
			let treeDocumentsRaw = [...await arc.utils.getRawTree(arc)];
			let treeDocumentsTreated = [...treeDocumentsRaw];

			// simplify the raw array from the db
			treeDocumentsRaw = treeDocumentsRaw.map(item => {
				return item.url;
			});

			// if we have a brand new entry, let's add it to the tree list
			// otherwise, lets update the list for a new entry 
			if (context.isNew) treeDocumentsTreated.push(context.toObject());
			else {
				treeDocumentsTreated = treeDocumentsTreated.map(item => {
					if (item._id.toString() === context._id.toString()) return context.toObject();
					return item;
				});
			}

			const treeToBeUpdated = arc.utils.mapUrlsToTree(treeDocumentsTreated).filter(item => {
				return !treeDocumentsRaw.includes(item.url);
			});
		
			await updateAllUrls(treeToBeUpdated);

			resolve();
		
		} catch(err) {
			arc.log('error', err);
			return reject();
		}
		
				

  	});

	async function updateAllUrls(list) {

		return new Promise(async (resolve, reject) => {

			for (const item of list) {
				if (item._id === context._id) {
					context.url = item.url;
				} else {
					await arc.utils.updateTreeItem(item._id, {url: item.url}, arc);
				}
  			}		

			return resolve();

		});
	}
};