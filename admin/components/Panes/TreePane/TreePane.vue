<template>
  <div class="tree">
    
    <div class="tree__list">
      <div v-if="!nestedTree">
        Loading...
      </div>
      <div v-if="nestedTree" class="tree__instruction-text">
        Drag to reorder, click to edit, right click for more
      </div>

      <!-- <draggable-tree :items="nestedTree" /> -->
      <sl-vue-tree 
        v-model="nestedTree" 
        ref="slVueTree" 
        @toggle="nodeToggled" 
        @select="nodeSelected"
        @drop="treeOrderUpdated"
        @nodecontextmenu="showContextMenu"
      >
        
        <template slot="title" slot-scope="{node}">
          <!-- <span class="item-icon">
            <i class="fa fa-file" v-if="node.isLeaf"></i>
            <i class="fa fa-folder" v-if="!node.isLeaf"></i>
          </span> -->
          {{node.title}}
        </template>

        <template slot="draginfo"></template>

      </sl-vue-tree>

      <div class="context-menu" ref="contextmenu" v-show="contextMenuIsVisible" :style="{position: 'absolute'}">
        <ul>
          <li @click="newPage(contextMenuNode)">Create Page</li>
          <li v-if="contextMenuNode && contextMenuNode.isLeaf && !contextMenuNode.children.length" @click="makeNodeParent(contextMenuNode)">Make parent</li>
          <li v-else-if="contextMenuNode && !contextMenuNode.isLeaf && !contextMenuNode.children.length" @click="unMakeNodeParent(contextMenuNode.path)">Unmake Parent</li>
          <li @click="">Remove</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script src="./TreePane.js"></script>
<style src="./TreePane.scss"></style>