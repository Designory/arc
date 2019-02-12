import draggable from 'vuedraggable';
import contextMenu from 'vue-context-menu';
import axios from 'axios';
import _ from 'lodash';
import Badge from '../../SubComponents/Badge/Badge.vue';
import universalUtils from '../../../../utils/universal';

export default {
  components: {
    draggable,
    contextMenu,
    'badge':Badge
  },
  data(){
    return {
      ctxId: null,
      ctxIndent: null,
      ctxCanIndent:false,
      ctxCanOutdent:false,
      treeToggles: (localStorage.treeToggles) ? localStorage.treeToggles.split(',') : [],
      movedToIndex:null,
      movedFromIndex:null
    }
  },
  methods: {
    getTree(){
      axios
        .get('/arc/api/tree')
        .then(response => {

          console.log(response.data);

          this.$store.commit('UPDATE_TREE', response.data); 
        }).catch(error => {
          console.log(error);
        });
    },
    // todo: convert to socket
    indentationChange(id, indent, delta){
      let starterIndent;
      const newTree = _.cloneDeep(this.tree).map(function(item){
        if (item._id === id){
          starterIndent = parseInt(indent);
          item.indentLevel = parseInt(indent) + delta; 
        }
        else if (starterIndent && starterIndent >= parseInt(item.indentLevel)) {
          starterIndent = false;
        }
        else if (starterIndent && starterIndent < parseInt(item.indentLevel)) {
          item.indentLevel = parseInt(item.indentLevel) + delta;
        }
        return item;
      });
      
      // bake into one action!!!!!

      this.$socket.emit('updateTree', universalUtils.objArrayDiff(newTree, this.$store.state.tree));
      this.$store.commit('UPDATE_TREE', {tree:newTree});

    },
    onCtxOpen(locals) {
      
      locals.indent = locals.indent ? parseInt(locals.indent) : false;
      locals.prevIndent = locals.prevIndent ? parseInt(locals.prevIndent) : false;

      this.ctxId = locals.id;
      this.ctxIndent = locals.indent;
      this.ctxCanIndent = (locals.prevIndent - locals.indent === 1 || locals.prevIndent - locals.indent === 0) && locals.index !== 0,
      this.ctxCanOutdent = (locals.indent - locals.prevIndent === 1 || locals.prevIndent - locals.indent === 0) && locals.index !== 0
    },
    toggleTree(id){

      const treeCollapsedIds = (localStorage.treeToggles) ? localStorage.treeToggles.split(',') : [];
      const inLocalStorage = treeCollapsedIds.includes(id);
      
      if (!inLocalStorage) treeCollapsedIds.push(id);
      else _.pull(treeCollapsedIds, id);

      this.treeToggles = treeCollapsedIds;

      localStorage.treeToggles = this.treeToggles.join(',') || '';
    },
    isActive(id){
      return this.$store.state.route.query.pageId === id;
    },
    isParent(currentIndentLevel, nextItem){

      if (!nextItem) return false;

      currentIndentLevel = parseInt(currentIndentLevel);
      const nextIndentLevel = parseInt(nextItem.indentLevel);

      return nextIndentLevel > currentIndentLevel;
    },
    isLastChild(currentIndentLevel, nextItem){

      if (!nextItem) return true;

      currentIndentLevel = parseInt(currentIndentLevel);
      const nextIndentLevel = parseInt(nextItem.indentLevel);

      return nextIndentLevel < currentIndentLevel;
    },
    isToggle(id){
      
      const currentIndex = this.$store.state.tree.findIndex(item => {
        return item._id === id;
      });
      
      const currentItem = this.$store.state.tree[currentIndex]
      const nextItem = this.$store.state.tree[currentIndex + 1]

      if (!nextItem) return false;

      return parseInt(nextItem.indentLevel) > parseInt(currentItem.indentLevel);

    },
    dragging(moveEvent){
      //console.log(moveEvent);

      this.movedToIndex = moveEvent.draggedContext.futureIndex;
      this.movedFromIndex = moveEvent.draggedContext.index;
    }
  },
  computed: {
    tree: {
      get(){
        
        if (this.$store.state.tree && this.$store.state.tree.length){
          
          return universalUtils.hideTreeChildrenByIds(this.$store.state.tree, this.treeToggles);

        } else {
          return null
        }
      },
      set(updatedTree){
        let treeStateClone = _.cloneDeep(this.$store.state.tree);
        let indentLevelDiff = 0;
        let currentSortOrder = -1;
        let sortOrderIncrement = .0000000001;
        const movedItemIndex = treeStateClone.findIndex(item => { return item._id === updatedTree[this.movedToIndex]._id });

        if (this.movedToIndex === 0) {
          treeStateClone[movedItemIndex].sortOrder = -1;
          treeStateClone[movedItemIndex].indentLevel = 1;
        } else {
          currentSortOrder = treeStateClone[movedItemIndex].sortOrder = updatedTree[this.movedToIndex - 1].sortOrder + sortOrderIncrement;  
          indentLevelDiff = parseInt(updatedTree[this.movedToIndex - 1].indentLevel) - parseInt(updatedTree[this.movedToIndex].indentLevel);
          treeStateClone[movedItemIndex].indentLevel = updatedTree[this.movedToIndex - 1].indentLevel;
        }

        let currentIndent = parseInt(this.$store.state.tree[movedItemIndex].indentLevel);
        let orderFactor = 1;

        for (let i = movedItemIndex + 1, len = treeStateClone.length; i < len; i++) {
          if (parseInt(treeStateClone[i].indentLevel) > currentIndent) {
            ++orderFactor;
            treeStateClone[i].sortOrder = currentSortOrder + (sortOrderIncrement * orderFactor);
            treeStateClone[i].indentLevel = parseInt(treeStateClone[i].indentLevel) + indentLevelDiff
          }
          else break; 
        }

        treeStateClone = _.sortBy(treeStateClone, 'sortOrder');

        // reset sort orders to be full integers
        treeStateClone = treeStateClone.map((item, index, arr) => {
          item.sortOrder = index;
          return item;
        });

        this.$socket.emit('updateTree', universalUtils.objArrayDiff(treeStateClone, this.$store.state.tree));
        this.$store.commit('UPDATE_TREE', treeStateClone);
      
      }
    }
  },
  beforeMount(){

    if (!localStorage.treeToggles) localStorage.treeToggles = '';

    this.getTree();
  
  },
  sockets: {
    // connect() {
    //   // Fired when the socket connects.
    //   console.log('socket is bubbling.')
    //   this.isConnected = true;
    // },
    // disconnect() {
    //   this.isConnected = false;
    // },
    // updateTree(tree) {
    //   this.tree = tree;
    // }
  }
};