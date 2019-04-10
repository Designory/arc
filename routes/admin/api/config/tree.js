const asyncHandler = require('express-async-handler');

module.exports = async (arc, req, res) => {

	const langObj = arc.getLangFromPath(req.header('Content-Language'));

	console.log(langObj);

	// temp workaround to handler issue
	//asyncHandler(async (arc, req, res) => {
		try {

			//console.log(arc.config.treeModelSelect);
			const rawTreeResults = await arc.utils.getRawTree(arc, {select:arc.config.treeModelSelect, sort:'sortOrder', lang:langObj});
			const treeResultsWithUrls = arc.utils.mapUrlsToTree(rawTreeResults, {lang:langObj});
		
			return res.apiResponse(treeResultsWithUrls);
		
		} catch(error) {
			arc.log('error', error);
			return res.error(error);
		}	
	//});
};
