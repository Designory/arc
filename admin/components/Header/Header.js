import axios from 'axios';

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
      activeLang:activeItem || this.$store.state.globals.lang.primary
    }
  },
  computed: {
    langs(){
      
      if (!this.$store.state.globals.lang) return [];

      return [this.$store.state.globals.lang.primary]
        .concat(this.$store.state.globals.lang.secondaries)
        .filter(item => {
          return item.path !== this.activeLang.path;
        });
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
    closeBuildModal(event){
      
    }
  },
  beforeCreate(){
    
    console.log(this.$store.getters.getRequestHeaders);

    axios.defaults.headers = this.$store.getters.getRequestHeaders;

  }
};
