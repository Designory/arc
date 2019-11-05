import axios from 'axios';
import _ from 'lodash';

export default {

  data() {
    
    if (!this.$store.state.globals.lang) return {};

    // gather active path object at page load
    const activeItem = [this.$store.state.globals.lang.primary]
        .concat(this.$store.state.globals.lang.secondaries)
        .filter(item => {
          return item.path === this.$store.state.route.params.lang;
        })[0]; 

    return {
      langSelectActive:null,
      activeLang:activeItem || this.$store.state.globals.lang.primary,
      backToListVisible:false
    }
  },
  computed: {
    langs(){
      
      if (!this.$store.state.globals.lang) return [];

      return [this.$store.state.globals.lang.primary]
        .concat(this.$store.state.globals.lang.secondaries);
        // .filter(item => {
        //   return item.path !== this.activeLang.path;
        // });
    },
    hideBackArrow(){
      const internalPathSlugs = ['list', 'page-builder'];
      return !internalPathSlugs.some(slug => this.$route.path.includes(slug))
    }
  },
  methods: {
    changeLang(lang){
      this.activeLang = lang;

      // set header defaults so that axios passes the current lang in 
      // all axaj gets and posts
      axios.defaults.headers = this.$store.getters.getRequestHeaders;

      if (this.$store.state.route.path === '/') this.$router.push(`/${lang.path}/`);
      else this.$router.push({params:Object.assign(this.$store.state.route.params || {}, {lang:lang.path}), query:Object.assign(this.$store.state.route.query || {})});
       
      // in the future, we can remap to the various places where this needs to refresh
      // components with new data calls
      // for now, this is the expedient way to refresh with the proper language data  
      this.$router.go();

    },
    iframeClicked(iframeEl) {
      setTimeout(() => {
        if (this.$store.state.iframeRef.contentDocument.location.href.split('/keystone/')[1].indexOf('/') !== -1 && !this.backToListVisible) {
          this.backToListVisible = true;
        }
      }, 500);
    },
    goBack() {
      if(this.$store.state.iframeRef){
        this.$store.state.iframeRef.contentWindow.history.back();
        this.backToListVisible = false;
      }
    }
  },
  beforeCreate(){
    axios.defaults.headers = this.$store.getters.getRequestHeaders;
  },
  beforeMount(){
    this.$router.beforeEach((to, from, next) => {
      this.$store.commit('SET_IFRAME_REF', null);
      next();
    });
  },
  mounted(){
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_IFRAME_REF' && mutation.payload !== null) {
        mutation.payload.contentDocument.querySelector('body').addEventListener('click', this.iframeClicked);
      }
    });
  }
};




// import axios from 'axios';

// export default {

//   data() {
    
//     if (!this.$store.state.globals.lang) return {};

//     // gather active path object at page load
//     const activeItem = [this.$store.state.globals.lang.primary]
//         .concat(this.$store.state.globals.lang.secondaries)
//         .filter(item => {
//           return item.path === this.$store.state.route.params.lang;
//         })[0]; 


   

//     return {
//       langSelectActive:null,
//       activeLang:activeItem || this.$store.state.globals.lang.primary,
//       backToList:''
//     }
//   },
//   computed: {
//     langs(){
      
//       if (!this.$store.state.globals.lang) return [];

//       return [this.$store.state.globals.lang.primary]
//         .concat(this.$store.state.globals.lang.secondaries);
//         // .filter(item => {
//         //   return item.path !== this.activeLang.path;
//         // });
//     },
//     hideBackArrow(){
//       const internalPathSlugs = ['list', 'page-builder'];
//       return !internalPathSlugs.some(slug => this.$route.path.includes(slug))
//     }
//   },
//   methods: {
//     changeLang(lang){
//       this.activeLang = lang;

//       // set header defaults so that axios passes the current lang in 
//       // all axaj gets and posts
//       axios.defaults.headers = this.$store.getters.getRequestHeaders;

//       if (this.$store.state.route.path === '/') this.$router.push(`/${lang.path}/`);
//       else this.$router.push({params:Object.assign(this.$store.state.route.params || {}, {lang:lang.path}), query:Object.assign(this.$store.state.route.query || {})});
       
//       // in the future, we can remap to the various places where this needs to refresh
//       // components with new data calls
//       // for now, this is the expedient way to refresh with the proper language data  
//       this.$router.go();

//     },
//     closeBuildModal(event){
      
//     },
//     goBack() {
//       this.$store.state.iframeRef.back();
//     }
//   },
//   beforeCreate(){
    
//     //console.log(this.$store.getters.getRequestHeaders);

//     axios.defaults.headers = this.$store.getters.getRequestHeaders;

//   },
//   beforeMount(){
//     this.$router.beforeEach((to, from, next) => {
//       this.$store.commit('SET_IFRAME_REF', null);
//       next();
//     });
    
//     this.$store.subscribe((mutation, state) => {
//       if (mutation.type === 'SET_IFRAME_REF' && mutation.payload !== null) {
        
//         // if we have the capacity to go back
//         if (mutation.payload.contentDocument.location.href.split('/keystone/')[0].indexOf('/') !== -1) {
//           this.backToList = true;
//         } else {
//           this.backToList = null;
//         } 
//         //this.$store.state.route.params.listName

//         const srcObj = {
//           src:mutation.payload.contentDocument.location.href
//         }

//         // window.Object.observe(srcObj, function(changes) {
//         //   console.log(changes);
//         // });

//                 // Select the node that will be observed for mutations
//         const targetNode = mutation.payload.contentDocument.querySelector('body');

//         // Options for the observer (which mutations to observe)
//         //const config = { attributes: true, childList: true, subtree: true };

//         // // Callback function to execute when mutations are observed
//         // const callback = function(mutationsList, observer) {
//         //     for(let mutation of mutationsList) {
//         //         console.log(mutation);
//         //         // if (mutation.type === 'childList') {
//         //         //     console.log('A child node has been added or removed.');
//         //         // }
//         //         // else if (mutation.type === 'attributes') {
//         //         //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
//         //         // }
//         //     }
//         // };

//         // // Create an observer instance linked to the callback function
//         // const observer = new MutationObserver(callback);

//         // // Start observing the target node for configured mutations
//         // observer.observe(targetNode, config);

//         // Later, you can stop observing
//         //observer.disconnect();

//       }
    
//     })

//   }
// };
