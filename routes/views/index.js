
module.exports = (app, arc) => {
	const importRoutes = arc.importer(__dirname);
	const routes = {
		middleware: importRoutes('./middleware'),
	};

	// this should be the very last of all routes to be registered
	app.use(
		routes.middleware.getCurrentUrl,
		routes.middleware.getNavigationTree,
		routes.middleware.getCurrentPage,
		routes.middleware.populateModules,
		routes.middleware.renderPage
	);	

	// let runOnce = false;

	// app.use(async (req, res, next) => {

	// 	if (!runOnce) {
	// 		res.locals = await routes.middleware.getCurrentUrl(req, res);
	// 		res.locals = await routes.middleware.getNavigationTree(req, res);
	// 		res.locals = await routes.middleware.getCurrentPage(req, res);
	// 		res.locals = await routes.middleware.populateModules(req, res);
	// 		res.locals = await routes.middleware.renderPage(req, res);

	// 		next();

	// 	} else {
			
	// 		next();
		
	// 	}	
	// });
};