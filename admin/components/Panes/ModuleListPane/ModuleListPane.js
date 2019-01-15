import axios from 'axios';

export default {
  data(){
    return {
      list: null,
      listName: null
    }
  },
  methods: {
    getList(){
      this.listName = this.$route.params.listName.toLowerCase()

      axios
      .get(`/arc/api/${this.listName}`)
      .then(response => {
        this.list = response.data.data;
      }).catch(error => {
        console.log(error);
      });
    }
  },
  beforeMount(){
    this.getList();
  }
}