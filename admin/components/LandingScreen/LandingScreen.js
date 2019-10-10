const color = require('color');
const _ = require('lodash');

export default {
  computed:{
    links(){
      return this.$store.state.globals.app.landingPage;
    }
  },
  methods:{
    alphaOnHex(hex, alpha){
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    }
  }
}