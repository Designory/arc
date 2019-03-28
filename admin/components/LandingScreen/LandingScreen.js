export default {
  computed:{
    collections(){
      return this.$store.state.globals.app.landingPage
    }
  }
}