const arc = require('../../../index');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async (req, res, next) => {
 	
 	try {

		var view = new arc.View(req, res);

		//return res.json(res.locals);;
		//console.log(view);

		return view.render('index');
		//
		//
		//
	} catch(error) {
		console.log('errrorororor', error);
	}

});

