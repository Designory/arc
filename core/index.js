const fs = require('fs');
const path = require('path');
const keystone = require('keystone');
const keystonePublish = require('keystone-publish');
const dotenv = require('dotenv');
const _ = require('lodash');
const arcRouter = require('../routes/admin/');
const viewRouter = require('../routes/views/');
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

			// define arc routing
			this.set('pre:routes', app => arcRouter(app, this));

			this.keystonePublish.init({
				stgPrefix,
				keystone,
				prodPreviewParam
			});

			this.setConfig(configObject);

			this.keystone.init(configObject);
			
			this.langInit(configObject);
			
			this.cacheInit();

		}

		setConfig(configObject){

			this.config = configObject;

			this.config.treeModel = this.config.treeModel || 'Tree';
			this.config.treeModelSelect = this.config.treeModelSelect || 'sortOrder matchesLive name indentLevel hideFromMenu';
			this.config.homeSlug = this.config.homeSlug || 'home';

		}

		start() {
			
			if (process.env.NODE_ENV === 'production') return this.keystone.start();

			return this.keystone.start({
			    onStart: () => {
			        const server = keystone.httpsServer ? keystone.httpsServer : keystone.httpServer;
			        this.socketInit(server);

			        // write config file to the admin client side 
					// this allows the admin interface to start up 
					// without needing any ajax calls, thus, increasing 
					// performance and elliminating race condition 
					// complexities
					const settingsJsFile = path.join(__dirname, '../admin', 'settings.json');
					fs.writeFileSync(settingsJsFile, JSON.stringify({lang:this.config.lang || null, app:this.config.adminUi, model:this.getModels()}));

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

		setViewRoutes(siteRoutes) {
			return this.set('routes', app => {
				siteRoutes(app, this);
				viewRouter(app, this);
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
