const arc = require('../../../index');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {

	if (!res.locals.page.pageDataCode || res.locals.page.pageDataCode === '[]') {
		res.locals.modules = [];
		return next();
	}

	const loadedModules = await arc.utils.getPageModules(arc, res.locals.page.pageDataCode, {
		consolidateModules:true
	});

	if (loadedModules && loadedModules.length) res.locals.page.modules = loadedModules;
	else res.locals.page.modules = [];

	console.log(res.locals.page.modules[0].data);

	return next();

});

