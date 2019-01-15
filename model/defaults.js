const arc = require('../index');
const _ = require('lodash');

module.exports = {
	defaults: {
		listName: null, // required - model name
		listLabel: null, // optional - alternate option for Arc cma labeling
		initialConfig: null, // required - keystone/mongoose init config
		fieldConfig: null, // required - keystone/mongoose field types
		sortOrder: 100, // optional - define the order of display on the arc admin UI
		type: 'module', // options: module, template, meta, archive
		archive: false, // pulls list from all available entry
		listDependants: null, // optional - tells arc admin about supporting lists
		populate: null, // optional - mongoose populations for list
		select: null, // optional - mongoose field selections for list
		svg: null, // optional - mongoose field selections for list
		onRender: null, // optional - render middleware - params: onRender(data, stgPrefix, done){...}
	},
	required: [
		{
			property: 'listName',
			type: 'string'
		},
		{
			property: 'initialConfig',
			type: 'object'
		},
		{
			property: 'fieldConfig',
			type: 'array'
		}
	],
	validateRequired: function(data) {
		let valid = true;
		let errorMessage = '';
		const error = this.required.forEach(item => {
			if (!data[item.property]) {
				valid = false;
				errorMessage += `${item.property} is required. `;
			}
			else if (!this.typeHelper(item.type, data[item.property])) {
				errorMessage += `${item.property} must be a/an ${item.type}. `;
			}
		});

		return {
			result: valid,
			message: errorMessage
		};

	},
	typeHelper: function(type, value) {
		if (type === 'string') return (typeof value === 'string');  
		if (type === 'object') return _.isObject(value); 
		if (type === 'array') return _.isArray(value); 

		return false;
	},
	merge: function(data) {	
		
		if (!data.label) data.label = data.listName;

		const validation = this.validateRequired(data);

		if (validation.result) return Object.assign({}, this.defaults, data);
		else {
			arc.log('error', validation.message);
			return null;
		} 
	}
};

