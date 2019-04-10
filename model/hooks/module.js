const _ = require('lodash');

module.exports = (mergedData, StgList, ProdList, arc) => {
    	
    StgList.schema.pre('save', function(next){
		this.wasNew = this.isNew;
		next()
	});

	StgList.schema.post('save', async function(doc){
		// only trigger an update if the item is not new
		// new items receive thier own special emit via the page change trigger
		if (!this.wasNew) arc.io.emit('MODULECHANGE', {_id:null, modules:{[this._id]:Object.assign({}, this._doc, {_listName:mergedData.listName})}});

	});

	StgList.schema.post('remove', async function(doc){
		doc.listName = mergedData.listName;
		arc.io.emit('MODULECHANGE', {_id:doc._id, modules:{[doc._id]: Object.assign({}, doc._doc, {_delete:true, _listName:mergedData.listName})}});
	});

};