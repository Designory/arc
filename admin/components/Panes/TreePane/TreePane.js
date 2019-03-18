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
      newNode:false,
      test:true
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
		const placement = (node.isExpanded === true && !node.isLeaf) ? 'inside' : 'after';
		this.$refs.slVueTree.insert({node, placement:placement}, {title: `${universalUtils.awesomeWords()} New Page`, isLeaf: true});
		
		const changeDiff = universalUtils.objArrayDiff(this.flattenNodes(), _.cloneDeep(this.tree));
		if (!_.isEmpty(changeDiff)) {
			
			//console.log(" ==> ", changeDiff);	
			
			this.$socket.emit('updateTree', changeDiff);	

			//this.$store.dispatch('SOCKET_TREECHANGE', {tree:{changeDiff}});
		}	

    },
    treeOrderUpdated(){
    	const changeDiff = universalUtils.objArrayDiff(this.flattenNodes(), _.cloneDeep(this.tree));
		if (!_.isEmpty(changeDiff)) this.$socket.emit('updateTree', changeDiff);
    },
    flattenNodes() {

  		const returnArr = [];
  		let count = 0;

  		this.$refs.slVueTree.traverse((node, nodeModel, path) => {

			returnArr.push({
				hideFromMenu: nodeModel.hideFromMenu,
				indentLevel: node.path.length,
				matchesLive: nodeModel.matchesLive,
				name: node.title,
				sortOrder: count++,
				_id: nodeModel._id
			});

		});

    	return returnArr;

    }

  },
  beforeMount(){

    if (!localStorage.treeToggles) localStorage.treeToggles = '';

    this.getTree();
  
  },
  watch: {
    tree(newFlattTree, oldFlattTree) {
      
      //if (this.test === true) 
      	this.nestedTree = universalUtils.nestUrlsToTree(_.cloneDeep(newFlattTree), this.getPreOpenedNodes(), this.$route.query.pageId);

      //this.test = false;

    }//,
  //   nestedTree(newNestedTree, oldNestedTree) {

 

		// const changeDiff = universalUtils.objArrayDiff(this.flattenNodes(), _.cloneDeep(this.tree));

		// console.log('changeDiff -->', changeDiff);


		// if (!_.isEmpty(changeDiff) && oldNestedTree.length) {
		// 	this.$socket.emit('updateTree', changeDiff);
		// }
  //   }
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