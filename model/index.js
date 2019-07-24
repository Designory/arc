const dotenv = require('dotenv');
const _ = require('lodash');
const defaults = require('./defaults');
const buildUrls = require('./buildUrls');
const treeModelHooks = require('./hooks/tree');
const templateModelHooks = require('./hooks/template');
const moduleModelHooks = require('./hooks/module');

dotenv.load();

module.exports = ArcClass => {
	return class ArcModel extends ArcClass {
		constructor() {
			super();
			this.modelList = [];
		}

		register(configObject, callback){	
			// if there is no config object, bail
			if (!configObject) return this.log('error', 'An object must be registered.');
			// if the list is archived, do nothing with it
			if (configObject.archive) return this.log('info', `${configObject.listName} list is archived and will not be visible in Arc.`);

			configObject = defaults.merge(configObject);

			//if (this.config.lang) configObject.lang = this.config.lang.primary.path;

			configObject.primary = true;

			this.addPageFieldConfig(configObject);
			
			// do all the model magic
			this.modelInit(configObject, callback);	

			if (!this.config.lang) return;

			if (configObject.listName === this.config.treeModel || configObject.type.indexOf('template') != -1) {

				this.config.lang.secondaries.forEach(item => {

					const newConfigObject = Object.assign({}, configObject);

					newConfigObject.baseListName = newConfigObject.listName;
					newConfigObject.listName += item.modelPostfix;
					newConfigObject.lang = item;
					newConfigObject.primary = false;
					
					(function(self, config, callback){

						if (config.listName === self.config.treeModel) self.addPageFieldConfig(config, true);

						//console.log(newConfigObject.listName);

						self.modelInit(config, callback);

					})(this, newConfigObject, callback)

				});

			}

		}

		modelInit(configObject, callback) {
			
			//console.log('configObject.listName -----> ', configObject.listName);

			this.keystonePublish.register(configObject, (StgList, ProdList, next) => {
				// get data merged with defaults
				
				const mergedData = defaults.merge(configObject);	

				if (!configObject || configObject.archive) return next();

				this.addSchemas(StgList, ProdList);
				
				this.addModel(configObject, StgList, ProdList);
				
				this.cacheClearSaveHook(configObject, StgList, ProdList);
				
				this.setTreeConfig(configObject, StgList, ProdList);
				
				this.versionTickSaveHook(StgList, ProdList);

				// enable callback function
				if (callback && typeof callback === 'function') {
					//console.log('----> ', StgList.key, ProdList.key)
					callback(StgList, ProdList, next);
				} else {
					next();
				}
			});
		}

		addSchemas(StgList, ProdList){
			StgList.schema.add({ modules: this.keystone.mongoose.Schema.Types.Mixed });
			ProdList.schema.add({ modules: this.keystone.mongoose.Schema.Types.Mixed });

			StgList.schema.add({ arc_custom: this.keystone.mongoose.Schema.Types.Mixed });
			ProdList.schema.add({ arc_custom: this.keystone.mongoose.Schema.Types.Mixed });

		}

		versionTickSaveHook(StgList, ProdList){
			StgList.schema.pre('save', function(next){
				if (this.modifiedPaths().length) this.increment();
				next();
			});
			ProdList.schema.pre('save', function(next){
				if (this.modifiedPaths().length) this.increment();
				next();
			});
		}

		setTreeConfig(mergedData, StgList, ProdList){
			
			const self = this;

			// special presave events that are designed only for the tree model
			if (mergedData.listName === this.config.treeModel) {

				treeModelHooks(mergedData, StgList, ProdList, this);
					
			} else if (mergedData.type.indexOf('module') != -1) {

				moduleModelHooks(mergedData, StgList, ProdList, this);
			
			} else if (mergedData.type.indexOf('template') != -1) {

				templateModelHooks(mergedData, StgList, ProdList, this);
				
			}			
		}

		addPageFieldConfig(configObject, secondaryLang) {
			
			configObject.fieldConfig.push({
				stopPostSaveHook: { 
					type: this.Field.Types.Boolean,
					hidden: true,
					default: false
				}
			});

			if (this.config.lang && configObject.type === 'module') {
				configObject.fieldConfig.push({
					langParentId: { 
						type:this.Field.Types.Text
					}
				});
			}

			if (this.config.lang && configObject.listName === this.config.treeModel) this.langPrimaryFieldConfig(configObject);
			if (this.config.lang && secondaryLang) this.langSecondaryFieldConfig(configObject);

		}
 
		addModel(config, stgList, prodList) {

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
