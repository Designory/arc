const arc = require('../../../index');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {

	if (!arc.config.lang || !arc.config.lang.config.globalLabelsListName) return next();
	
	res.locals.globals = res.locals.globals || {};
	const listConfig = arc.getModels(arc.config.lang.config.globalLabelsListName);

	// get list
	const globalsQuery = arc.arcList(arc.config.lang.config.globalLabelsListName).model.findOne({path:res.locals.langPath}).lean();

	if (listConfig.populate) globalsQuery.arcPopulate();

	globalsQuery.exec((err, results) => {

		if (err) {
			arc.log('error', err);
			return next();
		}

		res.locals.globals = Object.assign(res.locals.globals, results);

		return next();

	});

});