const Arc = require('../../../../index'); // so far back

module.exports = (req, res) => {
	const { params, query } = req;

	Arc.updateModule(params.type, params.id, query, req, (err, item) => {
		if (err) res.apiError(err);

		return res.apiResponse({ updated: item });
	});
};
