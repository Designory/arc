import draggable from 'vuedraggable';
import axios from 'axios';

export default {
  components: {
    draggable
  },
  data(){
    return {
      list: null,
      listName: null,
      moduleId: null,
      iframeName: null,
      iframe: null,
      searchInput: '',
      listItems: null,
      addPaneOpen: false,
    }
  },
  methods: {
    getList(){
      this.listName = this.$route.params.listName.toLowerCase();
      this.moduleId = this.$route.query.moduleId;

      axios
        .get(`/arc/api/${this.listName}`)
        .then(response => {
          this.list = response.data.data;
        }).catch(error => {
          console.log(error);
        });
    },
    addNewItem(){
      let container = document.querySelector('[data-form-container');
      let button = document.querySelector('[data-create-item-btn]');

      if(this.addPaneOpen === false){
        container.classList.remove('template-pane__form-container--hidden');
        button.innerHTML = 'Close';
        this.addPaneOpen = true;
      } else {
        button.innerHTML = 'Add New Item';
        this.closeNewItem();
        this.addPaneOpen = false;
      }
      
    },
    closeNewItem(){
      let button = document.querySelector('[data-create-item-btn]');
      let container = document.querySelector('[data-form-container');
      this.addPaneOpen = false;
      button.innerHTML = 'Add New Item';
      container.classList.add('template-pane__form-container--hidden');
    },
    searchHandler(){
      let searchValue = this.searchInput

      if(this.listItems){
        
        [...this.listItems].forEach((item) => {
          if(item.innerHTML.includes(searchValue) || item.innerHTML.toLowerCase().includes(searchValue.toLowerCase())){
            item.style.display = 'block'
          } else {
            item.style.display = 'none'
          }
        });
      }
    },
    createNewItem(){
      let self = this;
      let nameField = document.querySelector('[data-name-field]');

      axios
        .post(`/arc/api/${this.listName}/create`, {
          name: nameField.value
        })
        .then(response => {
          if(response.status === 200){
            let id = JSON.parse(response.request.response).created._id;

            self.$router.push({ path: `/template-view/${this.listName}`, query: { moduleId: id }});
            self.closeNewItem();
            nameField.value = "";
          } else {

          }
        });
    }
  },
  beforeMount(){
    this.getList();
  }
};
