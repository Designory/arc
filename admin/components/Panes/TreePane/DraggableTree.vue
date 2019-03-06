<template>
  <div>

    <draggable
      class="tree__drag-block"
      :element="'ul'"
      :list="items"
      :options="{ group: { name: 'g1' } }">

      <li 
        v-for="item in items" 
        :key="item._id" 
        class="tree__list-item" 
        
        @contextmenu.prevent="$refs.ctx.open($event, {id: item._id})">
          
          <router-link 
            tag="span" 
            :to="{path: `/page-builder/tree`, query: { pageId : item._id} }"
            class="tree__right-click-area"> 
            
            {{item.name}}
          
          </router-link>

          <draggable-tree v-if="item.items" :items="item.items" />
      </li>
    </draggable>
  
    <context-menu id="context-menu" class="context-menu" ref="ctx" slot-scope="child">
        <li v-on:click="newPage(child.data)">New</li>
        <li><a href="" target="_blank">Preview</a></li>
        <li class="disabled">Publish</li>
    </context-menu>

  </div>
</template>

<script src="./DraggableTree.js"></script>
<!-- <li
    v-for="(item, index) in tree"
    :key="item._id"
    @contextmenu.prevent="$refs.ctx.open($event, {id: item._id, indent: item.indentLevel, prevIndent:tree[index - 1] ? tree[index - 1].indentLevel : false, index:index})" 
    :style="{marginLeft: ((item.indentLevel * 22) -22) + 'px'}"
    :class="{
      'tree__list-item--indented': (item.indentLevel > 1 && true),
      'tree__list-item--active': isActive(item._id),
      'tree__list-item--parent': isParent(item.indentLevel, tree[index + 1]),
      'tree__list-item--lastchild': isLastChild(item.indentLevel, tree[index + 1])
    }"
    class="tree__list-item">
      <router-link tag="span" 
      :to="{path: `/page-builder/tree`, query: { pageId : item._id} }"
      class="tree__right-click-area"> 
        {{item.name}}
      </router-link>
      <button 
        class="tree__toggle"
        @click="toggleTree(item._id)"
        :class="{'tree__toggle--collapsed': treeToggles.includes(item._id)}"
        v-if="isToggle(item._id)">
      </button> 
  </li> -->