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

        console.log(state.globals.lang.secondaries);

        const secondaryMatch = state.globals.lang.secondaries.filter(item => {
            return item.path === path;
        })[0];

        if (secondaryMatch) return secondaryMatch;

        return null;

    },
    
    getModelFromPath: (state, getters) => {
        const langObj = getters.getLangObjFromPath;

        console.log(state.globals.treeModel + langObj.modelPostfix)

        if (langObj) return state.globals.treeModel + langObj.modelPostfix;
        else return null;
    },

    getRequestHeaders: (state, getters) => {
    	return {
  			'Content-Language': getters.getLangPath
		}
    },
    
    isEditOnlyMode: state => {
    	if (!state.globals.lang) return false;
    	
    	if (state.globals.lang.primary.path === state.route.params.lang) return false;

    	return true;
    }
};