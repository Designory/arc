export default {
    components: {},
    computed: {
        list(){
            
            const activeList = this.$store.getters.getActiveList;
            const currentLang = this.$store.getters.getLangObjFromPath || {modelPostfix:''};
            
            if (!activeList.relatedLists) return [];

            return activeList.relatedLists.split(',').map(relatedListName => {   
                
                relatedListName = relatedListName.trim();
                
                let activeItem = this.$store.state.globals.model.find(({listName}) => relatedListName === listName);
                
                if (currentLang && !activeItem.noTranslate) {
                    activeItem = this.$store.state.globals.model.find(({listName}) => activeItem.listName + currentLang.modelPostfix === listName);
                }
                return {
                    name:activeItem.label || activeItem.listLabel || activeItem.listName,
                    slug:activeItem.listName
                }
            });
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