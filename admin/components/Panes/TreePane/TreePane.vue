<template>
  <div class="tree">
    
    <ul class="tree__list">
      <div v-if="!tree">
        Loading...
      </div>
      <draggable v-model="tree" :move="dragging">
        <li
          v-for="(item, index) in tree"
          :key="item._id"
          @contextmenu.prevent="$refs.ctx.open($event, {id: item._id, indent: item.indentLevel})" 
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
              <badge v-if="(!item.matchesLive)" :text="`v${item.__v}`" /> {{item.sortOrder}} - {{item.name}}
            </router-link>
            <button 
              class="tree__toggle"
              @click="toggleTree(item._id)"
              :class="{'tree__toggle--collapsed': treeToggles.includes(item._id)}"
              v-if="isToggle(item._id)">
            </button> 
        </li> 
      </draggable>
    </ul>

    <context-menu id="context-menu" class="tree__context-menu" ref="ctx"
    @ctx-open="onCtxOpen">
      <li v-on:click="testDropdown()">New</li>
      <li>Delete</li>
      <li class="disabled">Publish</li>
      <hr class="line" />
      <li v-on:click="indent(ctxId, ctxIndent)">Indent</li>
      <li v-on:click="outdent(ctxId, ctxIndent)">Outdent</li>
    </context-menu>

    <div class="tree__footer">
      <!-- <button class="btn btn--blue">
        Create New Chapter
      </button>

      <button class="btn">
        Upload PDF
      </button> -->
    </div>
  </div>
</template>

<script src="./TreePane.js"></script>
<style src="./TreePane.scss"></style>