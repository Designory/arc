const arc = require('../../../index');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {

	// of the the value already exists, 
	// then we don't need to set it
	// this is because it was already set 
	// with lang processing ./processLang.js
	if (!res.locals.pageUrl) {
		res.locals.pageUrl = req.originalUrl.split('?')[0];
	}

	if (res.locals.pageUrl === '/') {
		res.locals.pageUrl = arc.config.homeSlug || '/home';
	} 
	//console.log(res.locals.pageUrl);
	return next();

});