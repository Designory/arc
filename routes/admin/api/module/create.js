const Arc = require('../../../../index');

module.exports = (req, res) => {
	const { params, query } = req;

	return Arc.createModule(params.type, query, req, (err, item) => {
		if (err) return res.apiError(err);
		return res.apiResponse({ created: item });
	});
};
