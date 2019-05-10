const arc = require('../../../index');
const asyncHandler = require('express-async-handler');
const url = require('url');
const locale = require('locale');
const _ = require('lodash');

module.exports = asyncHandler(async (req, res, next) => {

	if (!arc.config.lang) return next();

	res.locals.pageUrl = res.locals.pageUrl || req.originalUrl.split('?')[0];

	const splitUrlArr = res.locals.pageUrl.substring(1).split('/');
	res.locals.langPath = splitUrlArr.shift();
	res.locals.pageUrl = '/' + splitUrlArr.join('/');

	// if we have the force lang query param,
	// set cookie
	if (req.query.setDefaultLang) {
		res.cookie('lang', req.query.setDefaultLang);
	}

	// if we have a lang cookie, we set it this way
	if (req.cookies.lang) {
		if (res.locals.langPath !== req.cookies.lang) return res.redirect(`/${req.cookies.lang}${res.locals.pageUrl}`);
		res.locals.langPath = req.cookies.lang;
	}

	res.locals.lang = arc.getAllLangs().find(lang => lang.path === res.locals.langPath);

	// force a redirect to primary lang if we come up empty
	if (!res.locals.lang) {	
		// best guess at browser language settings with primary lang backup
		const langGuess = req.locale || arc.config.lang.primary.path;	
		return res.redirect(`/${langGuess}${res.originalUrl}`);
	}

	res.locals.langList = arc.getAllLangs().map(item => {

		const splitUrlArr = req.originalUrl.substring(1).split('/');
		splitUrlArr.shift();
		item.url = `/${item.path}/${splitUrlArr.join('/')}`;
		item.current = res.locals.langPath === item.path;
		return item;

	});

	res.locals.langList = _.sortBy(res.locals.langList, item => {
  		return item.path === res.locals.lang;
	});

	return next();

});