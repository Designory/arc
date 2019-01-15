const Arc = require('../../../../index');

module.exports = (req, res) => {
	return res.apiResponse({app:Arc.config, model:Arc.getModels()});
};
