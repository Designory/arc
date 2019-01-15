<template>
  <div class="module-pane">
    <div v-if="!modules">
      Loading...
    </div>
    <ul class="module-pane__list">
      <router-link tag="div" 
          class="module-pane__list-item"
          v-for="module in modules" :key="module._id"
          v-if="module.type.includes('module')"
          :to="{name: 'moduleList', params: {listName: module.production.path}, query: { pageId: pageId }}">
        <div class="module-pane__list-item-icon">
          <div v-if="module.svg" v-html="module.svg"
              class="module-pane__list-item-svg"></div>
          <div v-else>
            No Icon
          </div>
        </div>
        <div class="module-pane__list-item-title">
          {{module.listName}}
        </div>
      </router-link>
     </ul>
  </div>
</template>


<script src="./ModulePane.js"></script>
<style src="./ModulePane.scss"></style>