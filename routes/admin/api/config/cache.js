const Arc = require('../../../../index');

module.exports = (req, res) => {
	
	return Arc.cache.keys( function(err, keys){
  		if (!err){
    		return res.apiResponse(keys);
  		} else {
			return res.apiResponse({'error':err});
  		}

	});
};
