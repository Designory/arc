const dotenv = require('dotenv');
const _ = require('lodash');
const defaults = require('./defaults');
const buildUrls = require('./buildUrls');

dotenv.load();

module.exports = ArcClass => {
	return class ArcModel extends ArcClass {
		constructor() {
			super();
			this.modelList = [];
		}

		register(configObject, callback) {
			// if there is nor config object, bail
			if (!configObject) return this.log('error', 'An object must be registered.');
			// if the list is archived, do nothing with it
			if (configObject.archive) return this.log('info', `${configObject.listName} list is archived and will not be visible in Arc.`);

			this.keystonePublish.register(configObject, (StgList, ProdList, next) => {
				// get data merged with defaults
				const mergedData = defaults.merge(configObject);

				if (!mergedData || mergedData.archive) return next();

				StgList.schema.add({ modules: this.keystone.mongoose.Schema.Types.Mixed });
				ProdList.schema.add({ modules: this.keystone.mongoose.Schema.Types.Mixed });

				this.addModel(mergedData, StgList, ProdList);
				
				this.cacheClearSaveHook(mergedData, StgList, ProdList);
				
				this.setTreeConfig(mergedData, StgList, ProdList);
				
				this.versionTickSaveHook(StgList);

				// enable callback function
				if (callback && typeof callback === 'function') {
					callback(StgList, ProdList, next);
				} else {
					next();
				}
			});
		}

		versionTickSaveHook(StgList){
			StgList.schema.pre('save', async function(next){
					
				//console.log(this.modifiedPaths().length, this.modifiedPaths());

				if (this.modifiedPaths().length) this.increment();

				next();

			});
		}

		setTreeConfig(mergedData, StgList, ProdList){
			
			const self = this;

			// special presave events that are designed only for the tree model
			if (mergedData.listName == this.config.treeModel) {

				StgList.schema.pre('save', async function(next){
				
					this.key = self.utils.slug(this.name);
					if (this.keyOverride) this.keyOverride = self.utils.slug(this.keyOverride);

					await buildUrls(self, this);

					next();

				});

				// special postsave events that are designed only for the tree model
				// TODO: move this to better spot
				StgList.schema.pre('save', function(next){
					this.pageDataCodeWasModified = this.isModified('pageDataCode');
					next();
				});

				StgList.schema.post('save', async function(doc){
				
					self.io.emit('PAGECHANGE', {[doc._id]: doc});

					if (this.pageDataCodeWasModified) {

						try {

		                    // TODO: consolidate to utils function
		                    const loadedModules = await self.utils.getPageModules(self, JSON.parse(doc.pageDataCode), {
		                        select:'name matchesLive existsOnLive visible state archive key __v', 
		                        onRender:null, 
		                        consolidateModules:false
		                    });

		                    self.io.emit('MODULECHANGE', {_id:doc._id, modules:loadedModules});
		                    
		                } catch(err){
		                    // TODO: set up error reporting to the UI
		                    //self.io.to(socket.id).emit('serverError', {issue:'Cannot get page modules.', error:error});
		                }
		            }

				});

				StgList.schema.post('remove', async function(doc){
					self.io.emit('PAGECHANGE', {[doc._id]: Object.assign({}, doc._doc, {_delete:true})});
				});
					
			} else if (mergedData.type.indexOf('module') != -1) {

				StgList.schema.pre('save', function(next){
					this.wasNew = this.isNew;
					next()
				});

				StgList.schema.post('save', async function(doc){
					//console.log('doc.matchesLive -> ', {[this._id]:Object.assign({}, this._doc, {_listName:mergedData.listName})})

					// only trigger an update if the item is not new
					// new items receive thier own special emit via the page change trigger
					if (!this.wasNew) self.io.emit('MODULECHANGE', {_id:this._id, modules:{[this._id]:Object.assign({}, this._doc, {_listName:mergedData.listName})}});

					//next();

				});

				StgList.schema.post('remove', async function(doc){
					doc.listName = mergedData.listName;
					self.io.emit('MODULECHANGE', {_id:doc._id, modules:{[doc._id]: Object.assign({}, doc._doc, {_delete:true, _listName:mergedData.listName})}});
				});
			}			
		}

		addModel(config, stgList, prodList) {
			//console.log(config.listName);

			this.addModelPopulations(stgList, prodList, config.populate);
			this.addModelSelections(stgList, prodList, config.select);

			config.production = {
				name: config.listName,
				path: prodList.path
			};

			config.staging = {
				name: this.keystonePublish.stgPrefix + config.listName,
				path: stgList.path
			};

			this.modelList.push(config);
		}

		getModels(listName) {

			if (listName) return this.modelList.filter(item => {
				return item.moduleName === listName || item.listName === listName;
			})[0];
			
			return this.modelList;
		}


		/**
		 * @param  Object	stgList		- keystone stage list
		 * @param  Object	prodList	- keystone prod list
		 * @param  String	populations - space deliniated field populations
		 * @return n/a
		 */
		addModelPopulations(stgList, prodList, populations) {
			function arcPopulate() {
				if (!populations) return this;
				else if (Array.isArray(populations)) {
					for (let i = 0, len = populations.length; i < len; i++) {
						this.populate(populations[i]);
					}
					return this;
				}

				return this.populate(populations);
			}

			stgList.schema.query.arcPopulate = arcPopulate;
			prodList.schema.query.arcPopulate = arcPopulate;
		}

		/**
		 * @param  Object	stgList		- keystone stage list
		 * @param  Object	prodList	- keystone prod list
		 * @param  String	selections - space deliniated field selctions (to avoid pulling in the whole set of data if needed)
		 * @return n/a
		 */
		addModelSelections(stgList, prodList, selections) {
			stgList.schema.query.arcSelect = prodList.schema.query.arcSelect = function() {
				if (!selections) return this;
				return this.select(selections);
			};
		}
	};
};
