const Arc = require('../../../../index'); // so far back

module.exports = (req, res) => {
	const { params } = req;

	Arc.removeModule(params.type, params.id, (err, removedModule) => {
		if (err) return res.apiError(err);

		return res.apiResponse({ removed: removedModule });
	});
};
