const arc = require('../../../index');
const asyncHandler = require('express-async-handler');
const url = require('url');

module.exports = asyncHandler(async (req, res, next) => {

	res.locals.pageUrl = res.locals.langPageUrl || req.originalUrl.split('?')[0];

	const currentPage = await arc.utils.getRawTree(arc, {
		query: (query) => {
			return query.where('url', res.locals.pageUrl);
		},
		lang: res.locals.lang || null 
	});

	if (currentPage.length) res.locals.page = currentPage[0];
	else res.locals.page = {};

	next();

});