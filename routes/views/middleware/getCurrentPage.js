const arc = require('../../../index');
const asyncHandler = require('express-async-handler');
const url = require('url');

module.exports = asyncHandler(async (req, res, next) => {

	if (arc.config.lang) {
		const splitUrlArr = res.locals.pageUrl.substring(1).split('/');
		res.locals.lang = splitUrlArr.shift();
		res.locals.pageUrl = '/' + splitUrlArr.join('/');
	}

	const currentPage = await arc.utils.getRawTree(arc, {
		query: (query) => {
			return query.where('url', res.locals.pageUrl);
		},
		lang:arc.config.lang
	});

	if (currentPage.length) res.locals.page = currentPage[0];
	else res.locals.page = {};

	next();

});