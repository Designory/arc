const asyncHandler = require('express-async-handler');

module.exports = async (arc, req, res) => {

	// temp workaround to handler issue
	//asyncHandler(async (arc, req, res) => {
		try {

			const rawTreeResults = await arc.utils.getRawTree(arc, {select:arc.config.treeModelSelect, sort:'sortOrder'});
			const treeResultsWithUrls = arc.utils.mapUrlsToTree(rawTreeResults);
		
			return res.apiResponse(treeResultsWithUrls);
		
		} catch(error) {
			arc.log('error', error);
			return res.error(error);
		}	
	//});
};
