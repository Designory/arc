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

          // const tree =  [...response.data].map((item) => {
          //   item.hidden = false;
          //   return item;
          // });

          this.$store.commit('SOCKET_TREEUPDATE', {tree:response.data}); 
        }).catch(error => {
          console.log(error);
        });
    },
    // todo: convert to socket
    indent(id, indent){
      if(id !== null){
        axios
        .post(`/arc/api/stg-pages/${id}/update?indentLevel=${parseInt(indent) + 1}`)
        .then(response => {
          if(response.status === 200){
            [...this.tree].forEach(function(item){
              if(item._id === id){
                item.indentLevel = parseInt(indent) + 1;
              }
            });
          } else {
            console.log('error');
          }
        });
      }
    },
    // todo: convert to socket
    outdent(id, indent){
      if(id !== null){
        if(parseInt(indent) - 1 !== 0){
          axios
          .post(`/arc/api/stg-pages/${id}/update?indentLevel=${parseInt(indent) - 1}`)
          .then(response => {
            if(response.status === 200){
              [...this.tree].forEach(function(item){
                if(item._id === id){
                  item.indentLevel = parseInt(indent) - 1;
                }
              });
            } else {
              console.log('error');
            }
          });
        } else {
          console.log("Can't outdent any further");
        }
      }
    },
    onCtxOpen(locals) {
      this.ctxId = locals.id;
      this.ctxIndent = locals.indent;
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
        
        console.log('compute function ran');

        if (this.$store.state.tree && this.$store.state.tree.length){
          
          return universalUtils.hideTreeChildrenByIds(this.$store.state.tree, this.treeToggles);
          //console.log(tree);

          //return tree;

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

        // treeStateClone = treeStateClone.sort(function(a, b){
        //    return a.sortOrder > b.sortOrder;
        // });


        // let updatedTree = _.cloneDeep(this.$store.state.tree);
        // const insertIndex = updatedTree.find(item => {return item._id === tree[this.movedToIndex]._id}).sortOrder;
        // const insertAfterItem = (tree[this.movedToIndex - 1]) ? tree[this.movedToIndex - 1] : null;
        // const moveBatch = [tree[this.movedToIndex]];
        // const batchFilterMap = [tree[this.movedToIndex]._id];
        
        // let currentIndent = parseInt(tree[this.movedToIndex].indentLevel);

        // for (let i = insertIndex + 1, len = updatedTree.length; i < len; i++) {
        //   if (parseInt(updatedTree[i].indentLevel) > currentIndent) {
        //     moveBatch.push(updatedTree[i]);
        //     batchFilterMap.push(updatedTree[i]._id);
        //   }
        //   else break; 
        // }
        
        // console.log(updatedTree);

        // updatedTree = updatedTree.filter(item => {          
        //   return !batchFilterMap.includes(item._id);
        // });

        // updatedTree.splice(this.movedToIndex, 0, ...moveBatch);

        // updatedTree.map((item, index, arr) => {
        //   if (!arr[index - 1]) item.indentLevel = 1;
        //   else if (parseInt(item.indentLevel) - parseInt(arr[index - 1].indentLevel) > 1) item.indentLevel = parseInt(item.indentLevel) + 1;
          
        //   item.sortOrder = index;
        //   return item;
        // })

        //console.log(updatedTree);

        // const newSortOrder = (tree[this.movedFromIndex + 1]) ? tree[this.movedFromIndex + 1].sortOrder - .5 : tree.length + 1; 

        // const updateIndex = 
        
        // fullTree[updateIndex].sortOrder = newSortOrder;

        // fullTree = fullTree.sort(function(a, b){
        //    console.log('dddddd');

        //    return a.sortOrder == b.sortOrder;
        // });





        //fullTree.splice(index, 0, item)

        //console.log(fullTree[deleteIndex].name, fullTree[insertIndex].name);
        // console.log(this.movedNewIndex, tree[this.movedNewIndex].name);
        // console.log(insertIndex);

        //console.log(this.movedOldIndex, tree[this.movedOldIndex].name);
        
        // let updateCount = 0; 
        // const updateChunk = [];
        
        // const baseIndentLevel = parseInt(fullTree[insertIndex].indentLevel);
        // for (let i = insertIndex + 1, len = fullTree.length; i < len; i++) {
          
        //   console.log(i);

        //   ++updateCount;

        //   updateChunk.push(fullTree[i]);

        //   if (baseIndentLevel >= parseInt(fullTree[i].indentLevel)) break;
        // }

        // console.log(updateCount, updateChunk);

        // fullTree.splice(insertIndex, 0, ...updateChunk);
        // fullTree.splice(deleteIndex, updateCount);

        // console.log('updateCount => ', updateCount);
        // console.log('insertIndex => ', insertIndex);
        // console.log('deleteIndex => ', deleteIndex);
        //console.log('updateChunk => ', updateChunk);

        // console.log(fullTree);

        

        this.$store.commit('SOCKET_TREEUPDATE', {tree:treeStateClone}); 


        //console.log('blah => ', typeof tree[this.movedOldIndex].sortOrder, tree[this.movedNewIndex]._id);
        //this.$store.commit('SOCKET_TREEUPDATE', {tree}); 

        // const highChange = Math.max(event.newIndex, event.oldIndex) + 1;
        // const lowChange = Math.min(event.newIndex, event.oldIndex);
        // const treeDiffEmmitArr = []
        
        // for (let i = lowChange; i < highChange; i++) {
        //   tree[i].sortOrder = i;
        //   treeDiffEmmitArr.push({
        //       _id:tree[i]._id,
        //       sortOrder:tree[i].sortOrder
        //   });
        // }
        // this.$socket.emit('updateTree', treeDiffEmmitArr);
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