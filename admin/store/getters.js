import _ from 'lodash';

export default {
    getLangPath: state => {
      if (!state.globals.lang) return null;
      else if (!state.route.params.lang) return state.globals.lang.primary.path;      
      else return state.route.params.lang;
    },
    getLangObjFromPath: (state, getters) => {
        
        const path = getters.getLangPath;

        if (path === null || path === 'null') return null;

        if (state.globals.lang.primary.path === path) return state.globals.lang.primary;

        const secondaryMatch = state.globals.lang.primary.secondaries.filter(item => {
            return item.path === path;
        })[0];

        if (secondaryMatch) return secondaryMatch;

        return null;

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