
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
		routes.middleware.populateModules
	);
};