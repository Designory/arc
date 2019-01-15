const Arc = require('../../../../index');

module.exports = (req, res) => {
	const { params, query } = req;

	Arc.getMultiModule(params.type, query.ids, (err, modules) => {
		if (err) return res.apiError(err);
		return res.apiResponse({ data: modules });
	});
};