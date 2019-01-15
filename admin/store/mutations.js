export default {
    SOCKET_PAGEUPDATE(state, message) {
      
      message = message[0] || message; // don't know why the socket puts this into an array 

      // update currently viewed page
      if (state.route.query.pageId === message._id) state.currentPageData = message;

      // update items in the tree
      if (state.tree) state.tree = state.tree.map(page => {
        if (page._id === message._id) {
          page.matchesLive = message.matchesLive;
          page.name = message.name; 
        }
        return page;
      });

    },
    
    SOCKET_MODULEUPDATE(state, message) {

      message = message[0] || message;

      if (state.route.query.pageId === message._id) state.currentModulesData = message.modules;

    },

    SOCKET_TREEUPDATE(state, message) {

      message = message[0] || message;

      state.tree = message.tree;

    },

    SOCKET_PAGEUPDATEPUBLISHSTATE(state, message) {

      message = message[0] || message;

      state.tree = state.tree.map(item => {
        if (item._id === message._id) item.matchesLive = message.isToProd;
        return item;
      });

      if (state.currentPageData._id === message._id) {
        state.currentPageData.matchesLive = message.isToProd;
      }
    },

    SET_ACTIVE_PAGE(state, message) {

      message = message[0] || message;

      state.activePage = message.pageId;

    }
};