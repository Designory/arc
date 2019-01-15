const arc = require('../../../index');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {

	res.locals.pageUrl = req.originalUrl.split('?')[0];
	if (res.locals.pageUrl === '/') arc.config.homeSlug || 'home';

	next();

});