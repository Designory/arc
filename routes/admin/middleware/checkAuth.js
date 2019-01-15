const keystone = require('keystone');

/**
 * Bounces the user to the signin screen if they are not signed in or do not have permission.
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */
module.exports = (req, res, next) => {
	
	console.log(req.user);

	if (!req.user || !req.user.canAccessArc) {
		// is this an API call?
		const isApiCall = req.headers.accept.match(/(?=\S)[^,]+?(?=\s*(,|$))/g)
			.find(element => element === 'application/json');

		// if not an API call, redirect to Keystone's signin page.
		if (!isApiCall) {
			const regex = new RegExp(`^/${keystone.get('admin path')}/?$`, 'i');
			const from = regex.test(req.originalUrl) ? '' : `?from=${req.originalUrl}`;

			return res.redirect(keystone.get('signin url') + from);
		}

		// if an API call, return a not authorized HTTP status code
		return req.user ?
			res.status(403).json({
				error: 'not authorized'
			}) :
			res.status(401).json({
				error: 'not signed in'
			});
	}
	return next();
};
