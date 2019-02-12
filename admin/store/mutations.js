import _ from 'lodash';

export default {
    UPDATE_PAGE(state, payload) {
      
      state.currentPageData = payload;
    
    },
    
    UPDATE_MODULE(state, payload) {

      state.currentModulesData = payload;

    },

    UPDATE_TREE(state, payload) {

      state.tree = payload;

    },

    SET_ACTIVE_PAGE(state, payload) {

      payload = payload[0] || payload;

      state.activePage = payload.pageId;

    }
};