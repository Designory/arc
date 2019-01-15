const Arc = require('../../../../index');

module.exports = (req, res) => {
	const { params } = req;

	Arc.getList(params.type, (err, modules) => {
		if (err) return res.apiError(err);
		return res.apiResponse({ data: modules });
	});
};
