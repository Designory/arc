const Arc = require('../../../../index'); // so far back

module.exports = (req, res) => {
	const { params, query } = req;

	Arc.updateModule(params.type, params.id, query, req, (err, item) => {
		if (err) res.apiError(err);

		res.apiResponse({ updated: item });
	});
};
