const express = require('express');
const path = require('path');

const router = express.Router();

module.exports = (app, arc) => {
	const importRoutes = arc.importer(__dirname);

	const routes = {
		middleware: importRoutes('./middleware'),
		api: importRoutes('./api')
	};

	// custom webpack middleware
	// runs once on first /arc/ request.
	// TODO: filter out api requests
	// TODO: hot-reload?
	

	router.use(routes.middleware.webpack);
	


	//router.use(routes.middleware.checkAuth);

	router.use('/static', arc.express.static(path.join(__dirname, '../../admin/public')));

	// ensure user is authenticated using session-based authentication
	// NOTE: basing all routing off a common root path eliminates the need for
	//       multiple route middleware definitions
	// app.use('/arc', routes.middleware.checkAuth);
	// app.use('/arc-admin/*', arcroutes.middleware.checkAuth);
	// app.use('/arc-api/*', arcroutes.middleware.checkAuth);
	// app.use('/arc-solo/module/*', arcroutes.middleware.checkAuth);
	// app.use('/arc-publish/*', arcroutes.middleware.checkAuth);
	// app.use('/arc/api/*', arcroutes.middleware.checkAuth);
	// ***************************************************************

	// app.all('/arc-api/sort-navigation', arcroutes.views.orderNavigation);

	// app.all('/arc-api/create-page', arcroutes.views.createPage);
	// app.all('/arc-api/create-chapter', arcroutes.views.createChapter);

	// app.post('/arc-api/delete-pages', arcroutes.views.deletePage);

	// app.get('/arc-solo-module/:name/:id', arcroutes.views.soloModule);
	// app.post('/arc-publish', arcroutes.views.publishPage);

	// app.all('/arc-api/navigation', arcroutes.views.getNavigation);
	// app.all('/arc-api/navigation/:section', arcroutes.views.getNavigation);

	router.get('/', (req, res) => {
		const templatePath = path.resolve(__dirname, '../../admin/public/index.html');
		return res.sendFile(templatePath);
	});

	// assumes using Keystone's authentication
	// router.get('/api/user', (req, res) => {
	// 	console.log(res);
	// 	return res.json({user:res.user, id:res.session.userId});
	// });

	// app.get('/arc-admin/:assetFile', function (req, res) {
	// 	res.sendFile(process.cwd() + '/arc/dist/' + req.params.assetFile);
	// });

	// // application modules
	// app.post('/arc-api/create-module/:collection/', keystone.middleware.api, arcroutes.views.createModule);
	// app.post('/arc-api/delete-module/:collection/:id', keystone.middleware.api, arcroutes.views.deleteModule);

	// // get pagebuilder preview url
	// app.all('/arc-api/preview/:collection/:id', arcroutes.views.getPagebuilderPreview);

	// app.all('/arc-api/:method/:list', arcroutes.views.api);
	// app.all('/arc-api/:method/:list/:id', arcroutes.views.api);

	// revised API
	router.get('/api/config', arc.middleware.api, routes.api.config.config);
	router.get('/api/cache', arc.middleware.api, routes.api.config.cache);
	router.get('/api/tree', arc.middleware.api, routes.api.config.tree);

	router.get('/api/modules/:_id', arc.middleware.api, routes.api.config.modules);
	
	router.get('/api/:type', arc.middleware.api, routes.api.module.list); // list all items of type
	router.get('/api/:type/multiple', arc.middleware.api, routes.api.module.multiple); // handles multiple get ids with a query parameter
	router.get('/api/:type/:id', arc.middleware.api, routes.api.module.get); // get item of type, by id
	router.post('/api/:type/create', arc.middleware.api, routes.api.module.create); // create item of type
	router.post('/api/:type/:id/update', arc.middleware.api, routes.api.module.update); // update item of type, by id
	router.delete('/api/:type/:id/remove', arc.middleware.api, routes.api.module.remove); // remove item of type, by id
	// end revised API

	app.use('/arc', router);
};