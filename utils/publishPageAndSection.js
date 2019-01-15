
module.exports = (itemId, updateData, arc) => {

	if (!itemId) return arc.log('error', 'First parameter `itemId` is required.')

	if (updateData._id) {
		updateData = Object.assign({}, updateData);
		delete updateData._id;
	}

	console.log(updateData);

	return new Promise((resolve, reject) => {
		
		try {

			const model = arc.utils.getTreeModel(arc);
			//const properUrl = item.properUrl || 

			// updates data without triggering any publishing hooks
    		model.update({_id:itemId}, updateData, (err) => {

    			if (err) {
    				arc.log('error', `Error trying to update ${itemId}`, err);
    				return reject();
    			}
    			
    			arc.log(`Finished saving ${itemId}`);

    			resolve();

    		});

		} catch(err) {
			arc.log('error', `Error trying to update ${itemId}`);
			reject();
		}
  	});
};