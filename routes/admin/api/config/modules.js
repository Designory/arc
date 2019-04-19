const arc = require('../../../../index');

module.exports = async (req, res) => {

	//console.log("req.header('Content-Language')  --> ", req.header('Content-Language'))

	const langObj = arc.getLangFromPath(req.header('Content-Language'));

	//console.log('modules langObj --> ', langObj)

	try {
			
		if (!req.params._id) {
			return res.apiResponse({'error':'A tree item id must be passed as a parameter.'})
		}

		// const cacheKey = `arcApi__modules__${req.params._id}${(langObj) ? langObj.modelPostfix : ''}`;
		// const cachedModules = arc.cache.get(cacheKey);

		// temporarily disable cache ---> `3 === 5`
		// if (cachedModules !== undefined && 3 === 5){
  			
  		// 	return res.apiResponse(cachedModules);
		
		// } else {

			const currentPageModel = await arc.utils.getRawTree(arc, {'_id': req.params._id, select:'pageDataCode', lang:langObj});
			const loadedModules = await arc.utils.getPageModules(arc, currentPageModel.pageDataCode, {
				select:'name matchesLive existsOnLive visible state archive key __v', 
				onRender:false, 
				consolidateModules:false,
				lean:true,
				decode: true,
				populate: false,
				customQuery: false
			});
			
			// arc.cache.set(cacheKey, loadedModules, function( err, success ){
  			// 	if (!err && success){
    		// 		console.log('cache =>> ', success);
  			// 	}
			// });

			return res.apiResponse(loadedModules);

		//}

	} catch(err) {
		arc.log('error', err);
	}
};