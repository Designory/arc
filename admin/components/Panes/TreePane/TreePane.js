import axios from 'axios';
import _ from 'lodash';
import DraggableTree from './DraggableTree.vue';
import SlVueTree from 'sl-vue-tree';
import universalUtils from '../../../../utils/universal';

export default {
  components: {
    //'draggable-tree': DraggableTree,
    'sl-vue-tree': SlVueTree
  },
  data(){
    return {
      nestedTree:[]
    }
  },
  computed: {
    tree: {
      get(){      
        if (this.$store.state.tree && this.$store.state.tree.length){
          return this.$store.state.tree;
        } else {
          return null
        }
      }
    }
  },
  methods: {
    getTree(){
      axios
        .get('/arc/api/tree')
        .then(response => { 
          this.$store.commit('UPDATE_TREE', response.data);
        }).catch(error => {
          console.log(error);
        });
    },
    getPreOpenedNodes(){
      return localStorage.treeToggles.split(',');
    },
    nodeToggled(node, event){
      const persistedOpenNodes = this.getPreOpenedNodes();
      const indexPosition = persistedOpenNodes.indexOf(node.data._id);

      if (indexPosition === -1) persistedOpenNodes.push(node.data._id);
      else persistedOpenNodes.splice(indexPosition, 1);

      localStorage.treeToggles = persistedOpenNodes.join(',');
    
    },
    nodeSelected(node, event){

      this.$router.push({query:{pageId:node[0].data._id}})
    
    },
    showContextMenu(node, event) {
        event.preventDefault();
        this.contextMenuIsVisible = true;
        const $contextMenu = this.$refs.contextmenu;
        $contextMenu.style.left = event.clientX + 'px';
        $contextMenu.style.top = event.clientY + 'px';
    },
    flatten(node, event) {
      
      let count = 0;

      return flattenTree(this.nestedTree, 1);

      function flattenTree(list, indentLevel){
        let returnArr = [];
        
        
        for (let i = 0, len = list.length; i < len; i++){
          
          //console.log(list[i]);
          returnArr.push({
            _id: list[i]._id,
            indentLevel: indentLevel,
            sortOrder:count++
          });
          
          if (list[i].children) {
            returnArr = returnArr.concat(flattenTree(list[i].children, indentLevel + 1))
          } else {
            indentLevel = 1;
          }
          
        }
        return returnArr;
      }
    }
  },
  beforeMount(){

    if (!localStorage.treeToggles) localStorage.treeToggles = '';

    this.getTree();
  
  },
  watch: {
    tree(newFlattTree, oldFlattTree) {
      this.nestedTree = universalUtils.nestUrlsToTree(_.cloneDeep(this.$store.state.tree), this.getPreOpenedNodes(), this.$route.query.pageId);
    },
    nestedTree(newNestedTree, oldNestedTree) {

      const stateTreeClone = [];

      for (let i = 0, len = this.$store.state.tree.length; i < len; i++) {
        stateTreeClone.push({
          _id: this.$store.state.tree[i]._id,
          indentLevel: parseInt(this.$store.state.tree[i].indentLevel),
          sortOrder: this.$store.state.tree[i].sortOrder
        });
      }

      this.$socket.emit('updateTree', universalUtils.objArrayDiff(this.flatten(), stateTreeClone));

    }
  }
};