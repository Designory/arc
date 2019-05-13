const arc = require('../../../index');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {


	// const treeData = arc.cache.get('tree');

	// if (treeData) {
	// 	res.locals.tree = treeData;
	// 	return next();
	// }

	const rawTreeResults = await arc.utils.getRawTree(arc, {select: arc.config.treeSelect || 'name key url indentLevel', sort:'sortOrder', lang: res.locals.lang || null});

	//console.log(rawTreeResults);

	if (rawTreeResults) res.locals.tree = rawTreeResults;
	else res.locals.tree = [];

	return next();

});