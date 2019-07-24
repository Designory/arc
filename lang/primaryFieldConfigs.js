const _ = require('lodash');

module.exports = (config, arc) => {
    	
    const overwriteOptions = arc.config.lang.secondaries.map(item => {
		return {
			value:item.path,
			label:item.label,
			config:item
		}
	});

	overwriteOptions.push({
		value:'all',
		label:'All'
	});

    config.fieldConfig.push({
        heading: 'Language Settings'
    });

	// this is yet to be used
	config.fieldConfig.push({
		forceLanguageOverwrite: { 
			type:arc.Field.Types.Select, 	
			options: overwriteOptions 
		}
	});

	// this is yet to be used
	config.fieldConfig.push({
		forceLanguageOverwrite: { 
			type:arc.Field.Types.Select, 	
			options: overwriteOptions 
		}
	});

};