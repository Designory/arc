module.exports = async (arc, req, res) => {

	try {
			
		if (!req.params._id) {
			return res.apiResponse({'error':'A tree item id must be passed as a parameter.'})
		}
		const cacheKey = `api__modules__${req.params._id}`;
		const cachedModules = arc.cache.get(cacheKey);

		if (cachedModules !== undefined && 3 === 5){
  			
  			return res.apiResponse(cachedModules);
		
		} else {

			const currentPageModel = await arc.utils.getRawTree(arc, {'_id': req.params._id, select:'pageDataCode'});
			const loadedModules = await arc.utils.getPageModules(arc, currentPageModel.pageDataCode, {
				select:'name matchesLive existsOnLive visible state archive key __v', 
				onRender:null, 
				consolidateModules:false,
				lean:true,
				decode: true
			});

			arc.cache.set(cacheKey, loadedModules, function( err, success ){
  				if( !err && success ){
    				console.log('cache =>> ', success);
  				}
			});

			return res.apiResponse(loadedModules);

		}

	} catch(err) {
		arc.log('error', err);
	}
};