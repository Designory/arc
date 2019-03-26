export default {
  data() {
    return {
      langSelectActive:null,
      activeLang: (this.$store.state.globals.lang) ? this.$store.state.globals.lang.primary : null
    }
  },
  computed: {
    langs(){
      
      if (!this.$store.state.globals.lang) return [];

      //return this.$store.state.globals.lang.secondaries;

      // const langList = [this.$store.state.globals.lang.primary].concat(this.$store.state.globals.lang.secondaries)

      // console.log(this.activeLang, langList);

      // return [];

      return [this.$store.state.globals.lang.primary]
        .concat(this.$store.state.globals.lang.secondaries)
        .filter(item => {
          return this.activeLang.path !== item.path;
        });
    }
  },
  methods: {
    changeLang(lang){
      this.activeLang = lang;
      //this.state.route.params
      this.$router.push({params:Object.assign(this.$store.state.route.params || {}, {lang:lang.path}), query:Object.assign(this.$store.state.route.query || {})});
    },
    closeBuildModal(event){
      
    }
  }
};
