import _ from 'lodash';

export default {
   
    getLangPath: state => {
      if (!state.globals.lang) return null;
      else if (!state.route.params.lang) return state.globals.lang.primary.path;      
      else return state.route.params.lang;
    },
    
    getLangObjFromPath: (state, getters) => {
        
        const path = getters.getLangPath;

        //console.log("state.globals.lang -- ", state.globals.lang);

        //if (!state.globals.lang) return null;

        if (path === null || path === 'null') return null;

        if (state.globals.lang.primary.path === path) return state.globals.lang.primary;

        //console.log(state.globals.lang.secondaries);

        const secondaryMatch = state.globals.lang.secondaries.filter(item => {
            return item.path === path;
        })[0];

        if (secondaryMatch) return secondaryMatch;

        return null;

    },
    
    getModelFromPath: (state, getters) => {
        const langObj = getters.getLangObjFromPath;

        if (!langObj) return null;
        else return state.globals.treeModel + langObj.modelPostfix;
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
    },
    getActiveList: (state, getters) => {

        if (!his.$store.state.route.params.listName) return null;

        const currentLang = this.$store.getters.getLangObjFromPath || {modelPostfix:''};
            
        // first we need to see if this particular list is intended to be translated
        // or if the translation feature is off, select the proper model
        const activeListNameNoLang = this.$store.state.route.params.listName;
        let activeItem = this.$store.state.globals.model.find(({listName}) => this.$store.state.route.params.listName === listName);

        if (currentLang && !returnObj.activeItem.noTranslate) {
            activeItem = this.$store.state.globals.model.find(({listName}) => activeItem.listName + currentLang.modelPostfix === listName);
        }

        return activeItem;

    }
};