const css = `
    
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:200,300,400,500,600,700');  

    *:not(.octicon):not(.mce-ico) {font-family: Open Sans,sans-serif !important;}

    .primary-navbar,
    .Toolbar,
    [data-keystone-footer],
    [for="produtionDifferences"],
    [data-field-name="publishToProduction"],
    .MobileNavigation {
      display: none;
    }
    .EditForm-container {
      margin: 25px 0;
    }
    #react-root {
      padding-top:0;
    }
 `;

let styleTag;

export default {
  data(){    
    return {
      pageOrigin:window.location.origin
    }
  },
  computed: {
    list(){
        const activeList = this.$store.getters.getActiveList;
        
        console.log(activeList);
        
        if (activeList && activeList.linkToProd) return activeList.production.path;
        else if (activeList) return activeList.staging.path
        else return null;
    }
},
  beforeMount(){
    this.listName = this.$route.params.listName.toLowerCase();
    this.moduleId = this.$route.query.moduleId;
    
    styleTag = document.createElement('style');
    styleTag.type ='text/css';
    styleTag.appendChild(document.createTextNode(css));

  },
  mounted(){

    let self = this;

    console.log(this.$refs);

    const listIframe = this.$refs['list-iframe'];


    if(listIframe){
      listIframe.addEventListener('load', () => {
        listIframe.contentDocument.head.appendChild(styleTag);
        listIframe.style.opacity = '1';
      });
    }
  }
}