const css = `
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
      padding-top:4em;
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
        if (activeList) return activeList.staging.path
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

    if(this.moduleId){
      let iframe = document.querySelector('[data-iframe]');
      let iframeName = iframe.name;
      
      frames[iframeName].addEventListener('load', () => {
        frames[iframeName].document.head.appendChild(styleTag);
        iframe.style.opacity = '1';
      });
    }
  }
}