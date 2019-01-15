<template>
<div class="module-list">
  <div class="module-list__top">
    <router-link 
      :to="{ path: '/page-builder/modules', query: {pageId: this.$route.query.pageId}}"
      tag="div" class="module-list__left">
      <svg class="arrow" width="21px" height="16px" viewBox="0 0 21 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="arrow" transform="translate(2.000000, 2.000000)" stroke="#979797" stroke-width="2">
              <path d="M1.5,6 L18,6" id="line"></path>
              <g id="tip">
                  <path d="M6.36396103,0 L0,6" id="Line"></path>
                  <path d="M6,12.363961 L-7.10542736e-15,6" id="Line"></path>
              </g>
          </g>
        </svg>
    </router-link>
    <div class="module-list__title">
      {{listName}}
    </div>
  </div>
  <div v-if="!list">
    Loading...
  </div>
  <div v-if="list.length === 0" class="module-list__no-items">
    No modules currently exist
  </div>
  <ul class="module-list__list">
    <li class="module-list__list-item" v-for="item in list" :key="item._id">
      {{item.name}}
    </li>
  </ul>
</div>
</template>

<script src="./ModuleListPane.js"></script>
<style src="./ModuleListPane.scss"></style>