import draggable from 'vuedraggable';
import contextMenu from 'vue-context-menu';
import _ from 'lodash';
import universalUtils from '../../../../utils/universal';

export default {
  name: "draggable-tree",
  props: {
    items: {
      type: Array
    }
  },
  components: {
    draggable,
    'context-menu':contextMenu
  },
  data(){
    return {
      movedToIndex:null,
      movedFromIndex:null,
      nestedTree:[]
    }
  },

  // name: "TreeItem",
  // props: [
  //   'item'
  // ],
  // components: {
  //   draggable,
  //   contextMenu
  // },
  // data(){
  //   return {}
  // },
  methods: {
    newPage(id) {
      console.log(id);
    }
  }
  // beforeMount(){

  
  // }

  






};