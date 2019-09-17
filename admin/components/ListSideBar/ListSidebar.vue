<template>
  <div class="sidebar">
    <div class="tree__list">
      <div class="tree">
        <div class="tree__list">
          <div class="tree__instruction-text">
            Related lists
          </div>
        </div> 
        <div class="sl-vue-tree sl-vue-tree-root">
          <div class="sl-vue-tree-nodes-list">
            <div class="sl-vue-tree-node" v-for="item in list">
              <router-link
              tag="div" 
              :to="{path: `state.route.params.lang/list/listName`}"
              >
               v-for="item in list" item.name v-for="item in list" :key="item._id"
              </router-link> 
            </div>
            
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script src="./ListSideBar.js"></script>
<style scoped src="./ListSideBar.scss"></style>