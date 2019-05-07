const Arc = require('../../../../index');

module.exports = (req, res) => {
	const { params } = req;

	// const langObj = Arc.getLangFromPath(req.header('Content-Language'));
	if (Arc.config.lang) {
		params.type = params.type + Arc.getLangFromPath('fr').modelPostfix;
	}
	
	params.type = 'stg-location__frs';

	// add suffix right here
	console.log(params.type);

	Arc.getModule(params.type, params.id, (err, module) => {
		if (err) return res.apiError(err);
		return res.apiResponse({ data: module });
	});
};
