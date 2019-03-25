<template>
  <div class="tree">
    
    <ul class="tree__list">
      <div v-if="!tree">
        Loading...
      </div>
      <div v-if="tree" class="tree__instruction-text">
        Drag to reorder, click to edit, right click for more
      </div>
      <draggable v-model="tree" :move="dragging">
        <li
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
              <!-- <badge v-if="(!item.matchesLive)" :text="`v${item.__v}`" /> --> <!-- {{item.sortOrder}} -  -->{{item.name}}
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

    <context-menu id="context-menu" class="context-menu" ref="ctx"
    @ctx-open="onCtxOpen">
      <li v-on:click="testDropdown()">New</li>
      <li>Delete</li>
      <li class="disabled">Publish</li>
      <div class="spacer"></div>
      <li :class="{disabled:!ctxCanIndent}" v-on:click="indentationChange(ctxId, ctxIndent, 1)">Indent</li>
      <li :class="{disabled:!ctxCanOutdent}" v-on:click="indentationChange(ctxId, ctxIndent, -1)">Outdent</li>
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