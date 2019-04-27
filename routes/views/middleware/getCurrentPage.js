const arc = require('../../../index');
const asyncHandler = require('express-async-handler');
const url = require('url');

module.exports = asyncHandler(async (req, res, next) => {
	
	const currentPage = await arc.utils.getRawTree(arc, {
		query: (query) => {
			return query.where('url', res.locals.pageUrl);
		},
		lang: res.locals.lang || null 
	});

	if (currentPage.length) res.locals.page = currentPage[0];
	else res.locals.page = {};

	return next();

});