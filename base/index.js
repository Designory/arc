const fs = require('fs');
const path = require('path');
const keystone = require('keystone');
const keystonePublish = require('keystone-publish');
const dotenv = require('dotenv');
const _ = require('lodash');
const initUiDefaults = require('./adminUiMiddleware');
const arcRouter = require('../routes/admin/');
const populateLocals = require('../routes/views/locals');
const viewRoutes = require('../routes/views/view');
const logger = require('../logging/');
const utilityFn = keystone.importer(__dirname)('../utils');

dotenv.load();

module.exports = function arcCore() {
	return class ArcCore {

		constructor() {
			// extended keystone properties
			this.keystone = keystone;
			this.keystonePublish = keystonePublish;
			this.Field = keystone.Field;
			this.List = keystone.List;
			this.content = keystone.content;
			this.middleware = keystone.middleware;
			this.View = keystone.View;
			this.express = keystone.express;
			this.theme = null;
			this.Storage = keystone.Storage;

			// extend keystones utility functions with our own
			this.utils = _.extend({}, keystone.utils, utilityFn);

		}

		init(configObject) {
			const {stgPrefix, prodPreviewParam} = configObject;

			this.keystonePublish.init({
				stgPrefix,
				keystone,
				prodPreviewParam
			});

			this.setConfig(configObject);

			this.keystone.init(configObject);
			
			this.cacheInit();

		}

		setConfig(configObject){

			this.config = configObject;

			this.config.treeModel = this.config.treeModel || 'Tree';
			this.config.treeModelSelect = this.config.treeModelSelect || 'sortOrder matchesLive name indentLevel hideFromMenu';
			this.config.homeSlug = this.config.homeSlug || 'home';
			this.config.stgPrefix = this.config.stgPrefix || 'Stg';
			this.config.cachekey = this.config.cachekey || '__CACHE__';

			if (this.config.lang) this.langInit(configObject);

			// see admin UI config being attached on the start command

		}

		async start() {
			
			if (process.env.NODE_ENV === 'production') return this.keystone.start();

			// admin ui config
			this.config.adminUi = initUiDefaults(this.config, this);
		
			return this.keystone.start({
			    onStart: () => {
						
						if (this.cache) {
							this.cacheFlush();
						}

						const server = keystone.httpsServer ? keystone.httpsServer : keystone.httpServer;

						this.socketInit(server);

					// write config file to the admin client side 
					// this allows the admin interface to start up 
					// without needing any ajax calls, thus, increasing 
					// performance and elliminating race condition 
					// complexities
					const settingsJsFile = path.join(__dirname, '../admin', 'settings.json');
					fs.writeFileSync(settingsJsFile, JSON.stringify({
						lang:this.config.lang || null, 
						app:this.config.adminUi, 
						model:this.getModels(),
						treeModel:this.config.treeModel,
						stgPrefix:this.config.stgPrefix
					}));

					// this is not ideal, but we'll go with a little delay for now
					// and do all the needed db adjustments once we have good reason 
					if (this.config.lang) {
						setTimeout(async () => {
						 await this.langStartup();
						}, 1000);
					}
			    }
			});
		}

		set(name, value) {
			return this.keystone.set(name, value);
		}

		get(name) {
			return this.keystone.get(name);
		}

		import(dirname) {
			return this.keystone.import(dirname);
		}

		importer(directory) {
			return this.keystone.importer(directory);
		}

		preRoute(middleware) {
			return this.keystone.pre('routes', middleware);
		}

		preRender(middleware) {
			return this.keystone.pre('routes', middleware);
		}

		list(modelName) {
			return this.keystone.list(modelName);
		}

		arcList(modelName){
			
			// for multilang we need to make sure the postfix was not 
			// accidently added to the modelName for non-translatable lists
			if (modelName.includes('__')) {
				const currentModel = this.getModels().find(item => {
					return modelName === item.listName;
				});

				if (currentModel.noTranslate) modelName = modelName.split('__')[0];

			}
	
			return this.list(this.keystonePublish.getList(modelName));
		
		}

		setViewRoutes(customRoutes) {
			
			// {
			// 	preArc:...,
			// 	preArcLocals:...,
			// 	preArcRender:...
			// }

			return this.set('routes', app => {
				
				// developer generated routes at first entry, set for things like SSO
				if (customRoutes.preArc) customRoutes.preArc(app, this); 


				// arc application GUI routes
				// we do not want arc to run in production
				// so we will bail if we are in production
				if (process.env.NODE_ENV !== 'production') {
					arcRouter(app, this); 
				}
				
				// developer generated routes before any locals are populated by a Arc
				if (customRoutes.preArcLocals) customRoutes.preArcLocals(app, this); 
				
				// top level page caching
				if (this.config.cache) {
					app.use((req, res, next) => {
						this.cacheRoutesMiddleware(req, res, next);
					});
				}

				// arc application routes
				populateLocals(app, this); 	
				
				// developer generated routes before any locals are populated by a Arc
				if (customRoutes.preArcRender) customRoutes.preArcRender(app, this); // developer generated routes before any locals are populated by a Arc

				// default page routes based on tree nesting
				viewRoutes(app, this); 
			
			});
		}

		log(level, msg) {
			// level options: trace, debug, info, warn, error, fatal
			// if no level is specified, default to 'info'
			if (!msg) {
				msg = level;
				level = 'info';
			}
			logger[level](msg);
		}
	};
};
