const arc = require('../../../index');
const asyncHandler = require('express-async-handler');
const url = require('url');

module.exports = asyncHandler(async (req, res, next) => {

	if (!arc.config.lang) return next();

	res.locals.pageUrl = res.locals.pageUrl || req.originalUrl.split('?')[0];

	const splitUrlArr = res.locals.pageUrl.substring(1).split('/');
	res.locals.langPath = splitUrlArr.shift();
	res.locals.langPageUrl = '/' + splitUrlArr.join('/');

	res.locals.lang = arc.getAllLangs().find(lang => lang.path === res.locals.langPath);

	// force a redirect to primary lang if we come up empty
	if (!res.locals.lang) return res.redirect(`/${arc.config.lang.primary.path}${req.originalUrl}`);

	next();

});