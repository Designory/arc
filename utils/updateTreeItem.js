// NOTE: need to add lang list updates here 

module.exports = (itemId, updateData, arc, lang) => {

	return new Promise((resolve, reject) => {
			
		try {

			// if no id is supplied, we must have a new item
			// so, utilize mongoose to generate a new id
			// sometimes the client side passes undeifned as a string
			if (!itemId || itemId === 'undefined') {
				arc.log(`"${updateData.name}" is new. Returning object for creation.`);
				return resolve(updateData);
			} 
			// we use the id as the key for the update,
			// we'll take it out of the body of the data
			if (updateData._id) {
				updateData = Object.assign({}, updateData);
				delete updateData._id;
			}

			const model = arc.utils.getTreeModel(arc, lang);
			//const properUrl = item.properUrl || 

			// updates data without triggering any publishing hooks
    		model.update({_id:itemId}, updateData, {}, (err) => {

    			if (err) {
    				arc.log('error', `Error trying to update ${itemId}`);
    				arc.log('error', err);
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