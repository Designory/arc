import axios from 'axios';
import _ from 'lodash';
import SlVueTree from 'sl-vue-tree';
import universalUtils from '../../../../utils/universal';

export default {
  components: {
    //'draggable-tree': DraggableTree,
    'sl-vue-tree': SlVueTree
  },
  data(){
    return {
      nestedTree:[],
      contextMenuIsVisible: false,
      contextMenuNode: null,
      newNode:false
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

      this.contextMenuNode = node;
      event.preventDefault();
      this.contextMenuIsVisible = true;
      const $contextMenu = this.$refs.contextmenu;
      $contextMenu.style.left = event.clientX + 'px';
      $contextMenu.style.top = event.clientY + 'px';

    },
    makeNodeParent(path) {
      this.$refs.slVueTree.updateNode(path, {isLeaf:false, isExpanded:false});
    },
    unMakeNodeParent(path) {
      this.$refs.slVueTree.updateNode(path, {isLeaf:true, isExpanded:false});
    },
    newPage(node){
		//this.newNode = true;
		console.log('node.isExpanded', node.isExpanded);
		const placement = (node.isExpanded === true && !node.isLeaf) ? 'inside' : 'after';
		this.$refs.slVueTree.insert({node, placement:placement}, {title: `${universalUtils.awesomeWords()} New Page`, isLeaf: true});
		//this.newNode = false;

    },
    flatten(list) {
      
      let count = 0;

      return flattenTree(list || this.nestedTree, 1);

      function flattenTree(list, indentLevel){
        let returnArr = [];
          
        for (let i = 0, len = list.length; i < len; i++){
          
          //console.log(list[i]);
          returnArr.push({
            _id: list[i]._id,
            indentLevel: indentLevel,
            sortOrder:count++,
            name:list[i].title
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
      
      console.log('------- tree update -------');

      this.nestedTree = universalUtils.nestUrlsToTree(_.cloneDeep(newFlattTree), this.getPreOpenedNodes(), this.$route.query.pageId);
    },
    nestedTree(newNestedTree, oldNestedTree) {

		const changeDiff = universalUtils.objArrayDiff(this.flatten(newNestedTree), this.flatten(oldNestedTree));

		if (!_.isEmpty(changeDiff) && oldNestedTree.length) {
			
			console.log('changeDiff --> ', changeDiff);

			//this.$socket.emit('updateTree', this.flatten(newNestedTree));
		}
    }
  },
  mounted() {
    
    // this is a cheat and is bad....need to fix later with vuex
    document.querySelector('body').addEventListener('click', event => {
      this.contextMenuIsVisible = false;
      this.contextMenuNode = null;
    });

    window.slVueTree = this.$refs.slVueTree;
  }
};