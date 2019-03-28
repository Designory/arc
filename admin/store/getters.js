import _ from 'lodash';

export default {
    getLangPath: state => {
      if (!state.globals.lang) return 'null';
      else if (!state.route.params.lang) return state.globals.lang.primary.path;      
      else return state.route.params.lang;
    },
    getRequestHeaders: (state, getters) => {
    	return {
  			'Content-Language': getters.getLangPath
		}
    },
    isEditOnlyMode: state => {
    	if (!state.globals.lang) return false;
    	
    	if (state.globals.lang.primary.path === state.route.params.lang) return false;

    	if (!state.globals.lang.config.secondaryEditOnly) return false;

    	return true;
    }
};