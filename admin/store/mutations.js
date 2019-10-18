import _ from 'lodash';

export default {
    UPDATE_PAGE(state, payload) {
      
      state.currentPageData = payload;
    
    },
    
    UPDATE_MODULE(state, payload) {
   
      state.currentModulesData = payload;

      //debugger;

    },

    MODULE_GHOST(state, payload) {

      state.moduleGhost = payload;

    },

    UPDATE_TREE(state, payload) {

      state.tree = payload;

    },

    SET_ACTIVE_PAGE(state, payload) {

      payload = payload[0] || payload;

      state.activePage = payload.pageId;

    },

    SET_IFRAME_REF(state, payload) {

      state.iframeRef = payload;
    
    }

};