const Arc = require('../../../../index');

module.exports = (req, res) => {
	const { params } = req;

	Arc.getModule(params.type, params.id, (err, module) => {
		if (err) return res.apiError(err);
		return res.apiResponse({ data: module });
	});
};
