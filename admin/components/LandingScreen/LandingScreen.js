const color = require('color');
const _ = require('lodash');

export default {
  computed:{
    links(){
      return this.$store.state.globals.app.landingPage;
    }
  }
}