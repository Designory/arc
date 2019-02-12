import draggable from 'vuedraggable';
import axios from 'axios';
import AddModule from '../SubComponents/AddModule/AddModule.vue';
import Button from '../SubComponents/Button/Button.vue';
import Badge from '../SubComponents/Badge/Badge.vue';
import Pill from '../SubComponents/Pill/Pill.vue';
import universalUtils from '../../../utils/universal';

const css = `
    .primary-navbar,
    .Toolbar,
    [data-keystone-footer],
    [for="produtionDifferences"],
    .MobileNavigation {
      display: none;
    }
    .EditForm-container {
      margin: 25px 0;
    }
    #react-root {
      padding-top:4em;
    }
 `;

let styleTag;


export default {
  data() {
    return {
      pageId: null,
      moduleId: null,
      pageOpen: false,
      pageOrigin:window.location.origin,
      removeId:null,
      contextActive:0,
      contextPosition:'top',
      addModulesList:false
    }
  },
  components: {
    draggable,
    'action-button':Button,
    'badge':Badge,
    'pill':Pill
  },
  computed: {
      pageData(){
        return this.$store.state.currentPageData;
      },
      moduleData: {
        get() {
          return this.$store.state.currentModulesData;
        },
        set(modules) {
          
          this.$socket.emit('updateTree', {_id:this.pageId, modules:modules});
          this.$store.commit('UPDATE_MODULE', {_id:this.pageId, modules:modules});

        }
      },
      previewUrl(){
        return this.pageOrigin + this.pageData.url;
      },
      moduleEditName(){
        if (!this.moduleId || !this.moduleData || !this.moduleData.length) return false;
        return this.moduleData.filter(module => {
          return this.moduleId === module.data[0]._id;
        })[0].data[0].name || '[undefined]';
      },
      availableModules(){
        return this.$store.state.globals.model.filter(item => {   
          return item.type.indexOf('module') != -1;
        });
      }
  },
  sockets: {
    // connect: function () {
    //         console.log('socket connected')
    // },
    SOCKET_CLOSEPAGE: function (data) {
      console.log(data, 'this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },

  methods: {
    getModuleData(){
      axios
        .get(`/arc/api/modules/${this.pageId}`)
        .then(response => {
          this.$store.commit('UPDATE_MODULE', response.data);
        }).catch(error => {
          console.log(error);
        });
    },
    getPageData(){
      axios
        .get(`/arc/api/stg-pages/${this.pageId}`)
        .then(response => {
          this.$store.commit('UPDATE_PAGE', response.data.data);
        }).catch(error => {
          console.log(error);
        });
    },
    iframeStyle(iframe){
      let name = iframe.name;
      frames[name].addEventListener('load', () => {
        frames[name].document.head.appendChild(styleTag);
        iframe.style.opacity = '1';
      });
    },
    modulePluralized(moduleName){
      // TODO: error handling for when module type no longer exists
      return this.$store.state.globals.model.filter(item => {
        return item.listName === moduleName;
      })[0].staging.path;
    },
    removeModule(moduleId){
      this.$socket.emit('removeModuleFromPage', {pageId:this.pageId, moduleId:moduleId});
    },
    removePage(moduleId){
      
      console.log('to remove page');

      //this.$socket.emit('removeModuleFromPage', {pageId:this.pageId, moduleId:moduleId});
    },
    publishPage(moduleId){
      this.$socket.emit('pagePublish', {pageId:this.pageId});
    },
    toggleAddModule(){
      console.log('openmodules')
      this.addModulesList = !this.addModulesList;
    },
    roundCorner(index){
      if (index === 0) return 'rounded-top-right';
      if (this.moduleData.length === (index + 1)) return 'rounded-bottom-right';
      return '';
    },
    badgeText(module){
      if (module.matchesLive) {
        return null;
      } else {
        return `Copy ${module.__v + 1}`;
      }
    },
    getStatusText(item){
      if (item.matchesLive === false) return 'draft';
      if (item.isVisible === false) return 'hidden';
      else return 'live';
    },
    getStatus(item){
      if (item.matchesLive === false) return 'inactive';
      if (item.isVisible === false) return 'inactive';
      else return 'active';
    },
    showContext(id, event){
      this.contextActive = (this.contextActive === id) ? 0 : id;
      this.contextPosition = (window.innerHeight - event.target.getBoundingClientRect().bottom < 200) ? 'top' : 'bottom';
    },
    createAndAddModule(type){
      console.log(this.$el);
      console.log(type);
    }
  },
  beforeMount(){
    this.pageId = this.$route.query.pageId;
    this.moduleId = this.$route.query.moduleId;
    this.moduleName = this.$route.query.moduleName;
    this.pageOpen = (this.$route.query.pageOpen || false);
    this.moduleOpen = (this.$route.query.moduleOpen || false);

    if (this.pageId) {
      this.getModuleData();
      this.getPageData();
    }

    styleTag = document.createElement('style');
    styleTag.type ='text/css';
    styleTag.appendChild(document.createTextNode(css));

    this.$store.commit('SET_ACTIVE_PAGE', {_id:this.pageId});

  },
  updated(){
    
    if(this.moduleOpen || this.pageOpen){
      
      // TODO: Probably should make this promise based
      let iframeFinder = setInterval(() => {
        let iframe = document.querySelector('[data-iframe]');
        if(iframe){
          this.iframeStyle(iframe);
          clearInterval(iframeFinder);
        }
      }, 100);
    }
  }
};