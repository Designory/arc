export default {
  data(){
    return {
      pageId: this.$route.query.pageId
    }
  },
  computed:{
    modules(){
      return this.$store.state.globals.model
    }
  }
}