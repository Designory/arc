import axios from 'axios';

export default {
  data() {
    return {
      name: null,
      type: null,
    }
  },
  computed: {
      moduleTypes(){
        return this.$store.state.globals.model.filter(item => {
          return item.type.includes('module');
        });
      },
      pageDataCode(){
        return this.$store.state.currentPageData.pageDataCode;
      },
      pageId(){
        return this.$store.state.currentPageData._id;
      },
      renderedModules(){
        return this.$store.state.currentModulesData;
      }
  },
  methods: {
    addModule(event){
      
      if (event) event.preventDefault();
      
      this.$socket.emit('newModule', {lang:this.$store.getters.getLangObjFromPath, name:this.name, type:this.type, _id:this.pageId, pageDataCode:this.pageDataCode});
      
      this.name = this.type = '';
    }//,
    
    // updatePageModules(modules){

    //   const pageDataCode = [];

    //   [...modules].forEach((module) => {
    //     let moduleObj = {};
    //     let itemIds = [];

    //     let moduleName = module.moduleName;
    //     itemIds.push(module.data[0]._id);

    //     moduleObj.moduleName = moduleName;
    //     moduleObj.itemIds = itemIds;

    //     pageDataCode.push(moduleObj);
    //   });

    //   this.$socket.emit('updateModules', {_id:this.pageId, modules:pageDataCode});
    // },
    // modulePluralized(moduleName){
    //   // TODO: error handling for when module type no longer exists
    //   return this.$store.state.globals.model.filter(item => {
    //     return item.listName === moduleName;
    //   })[0].staging.path;
    // }
  },
  beforeMount(){
    
  }
};