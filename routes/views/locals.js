const cookieParser = require('cookie-parser');
const locale = require('locale');

module.exports = (app, arc) => {
	const importRoutes = arc.importer(__dirname);
	const routes = {
		middleware: importRoutes('./middleware')
	};

	app.use(cookieParser());
			
	// add language middleware if multilang
	if (arc.config.lang) app.use(locale(arc.getAllLangs().map(lang => lang.path), arc.config.lang.primary.path))

	// this should be the very last of all routes to be registered
	app.use(
		routes.middleware.processLang,
		routes.middleware.getCurrentUrl,
		routes.middleware.getGlobals,
		routes.middleware.getNavigationTree,
		routes.middleware.getCurrentPage,
		routes.middleware.populateModules
	);
};