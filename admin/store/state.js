import globals from '../settings.json';

console.log(typeof globals) 

export default {
	globals: globals,
	currentPageData: null,
	currentModulesData: null,
	lockTree: false,
	tree: null
};