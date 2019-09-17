export default {
    components: {},
    computed: {
        list(){
            
            const activeList = this.$store.getters.getListObject;
            
            console.log(activeList);

            // const currentLang = this.$store.getters.getLangObjFromPath || {modelPostfix:''};
            
            // // first we need to see if this particular list is intended to be translated
            // // or if the translation feature is off, select the proper model
            // const activeListNameNoLang = this.$store.state.route.params.listName;
            // let activeItem = this.$store.state.globals.model.find(({listName}) => this.$store.state.route.params.listName === listName);

            // if (currentLang && !returnObj.activeItem.noTranslate) {
            //     activeItem = this.$store.state.globals.model.find(({listName}) => activeItem.listName + currentLang.modelPostfix === listName);
            // }
            
            
            // const relatedList = returnObj.activeItem.relatedLists.split(',').map(item => item = item.trim());

            // return {
            //     name: item.name,
            //     slug: item.staging.path
            // };


        }
    },
    methods: {
        getModuleData(){}
    },
    beforeMount(){
        //console.log('bleee bleee blee');
    },
    mounted(){
        // this is a cheat and is bad....need to fix later with vuex
        // document.querySelector('body').addEventListener('click', event => {
        //   if (this.contextActive) this.contextActive = 0;
        // });
        //console.log(this.$store.getters.getModelFromPath);
    },
    updated(){}
};