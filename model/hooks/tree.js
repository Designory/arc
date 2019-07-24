const _ = require('lodash');
const buildUrls = require('../buildUrls');

module.exports = (mergedData, StgList, ProdList, arc) => {
    	
	StgList.schema.pre('save', async function(next){

		if (this.keyOverride) this.keyOverride = arc.utils.slug(this.keyOverride);

		// for creating new tree items, we want to omit the typical page save hookd
		// but we don't want this to be carried through in the database, 
		// so we reset it after adding it to the context for post save access
		this.stoppingPostSaveHook = this.stopPostSaveHook;
		this.stopPostSaveHook = false;
		this.pageDataCodeWasModified = this.isModified('pageDataCode');
		//this.wasPublishedToProduction = this.publishToProduction;

		next();

	});

	StgList.schema.post('save', async function(doc){

		if (this.stoppingPostSaveHook) return;

		await buildUrls(arc, doc, mergedData.lang);

		arc.io.emit('PAGECHANGE', {[doc._id]: doc});

		if (this.pageDataCodeWasModified) {

			try {

				const parsedPageDataCode = JSON.parse(doc.pageDataCode)

                // TODO: consolidate to utils function
                const loadedModules = await arc.utils.getPageModules(arc, parsedPageDataCode, {
                    select:'name matchesLive existsOnLive visible state archive key __v', 
                    onRender:null, 
                    consolidateModules:false
                });

				arc.io.emit('MODULECHANGE', {_id:doc._id, modules:loadedModules});

				// update all secondary lang module according to the change of the primary
				if (mergedData.primary && arc.config.lang) {
					const updatedLangModules = await arc.langUpdateSecondaryModules(doc._id, parsedPageDataCode, this.wasPublishedToProduction);
				}

            } catch(err){
                // TODO: set up error reporting to the UI
                //arc.io.to(socket.id).emit('serverError', {issue:'Cannot get page modules.', error:error});
            }
        }

	});

	StgList.schema.post('remove', async function(doc){
		arc.io.emit('PAGECHANGE', {[doc._id]: Object.assign({}, doc._doc, {_delete:true, _lang:mergedData.lang})});
		if (mergedData.lang && mergedData.lang.primary) {
			arc.removeSecondaryLangTreeItems(mergedData, doc._id);
		}
	});

};