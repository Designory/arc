const arc = require('../../../index');
const asyncHandler = require('express-async-handler');
const url = require('url');
const locale = require('locale');

module.exports = asyncHandler(async (req, res, next) => {

	if (!arc.config.lang) return next();

	//console.log("Our default is: " + locale.Locale["default"] + "\n" + "The best match is: " + req.locale + "\n")
	//console.log(req.cookies)

	res.locals.pageUrl = res.locals.pageUrl || req.originalUrl.split('?')[0];

	const splitUrlArr = res.locals.pageUrl.substring(1).split('/');
	res.locals.langPath = splitUrlArr.shift();
	res.locals.pageUrl = '/' + splitUrlArr.join('/');

	res.locals.lang = arc.getAllLangs().find(lang => lang.path === res.locals.langPath);

	//console.log(res.locals.lang);

	// force a redirect to primary lang if we come up empty
	if (!res.locals.lang) {
		
		console.log('redirecting...')

		// best guess at browser language settings with primary lang backup
		const langGuess = req.locale || arc.config.lang.primary.path;	
		return res.redirect(`/${langGuess}${req.originalUrl}`);

	}

	return next();

});