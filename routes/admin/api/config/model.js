const Arc = require('../../../../index');

module.exports = (req, res) => {
	const { params } = req;
	if (params.model) return res.apiResponse(Arc.getModels(params.model));
	else return res.apiResponse(Arc.getModels());
};
