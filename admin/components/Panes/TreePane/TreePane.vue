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
        @nodeContextmenu="showContextMenu">
        
        <template slot="title" slot-scope="{node}">
          <!-- <span class="item-icon">
            <i class="fa fa-file" v-if="node.isLeaf"></i>
            <i class="fa fa-folder" v-if="!node.isLeaf"></i>
          </span> -->
          {{node.title}}
        </template>

      </sl-vue-tree>

    </div>
  </div>
</template>

<script src="./TreePane.js"></script>
<style src="./TreePane.scss"></style>