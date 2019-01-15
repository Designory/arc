<template>
  <div class="page-builder" v-if="pageData" :style="(pageOpen) ? {background:'#fafafa'} : ''">
    <div class="page-builder__top">
      <div class="page-builder__top-left">
        <action-button v-if="pageOpen || moduleOpen" :to="{ path: '/page-builder/tree', query: { pageId: pageId}}" text="Back"></action-button>
      </div>
      <div class="page-builder__top-right" v-if="!pageOpen">
        <a :href="previewUrl" target="_blank" class="btn">
          Preview
        </a>
        <button class="btn btn--green btn--small">
          Publish
        </button>
      </div>    
    </div>

    <div class="page-builder__iframe-container" v-if="pageOpen">
      <iframe
        :src="`${pageOrigin}/keystone/stg-pages/${pageId}`"
        class="page-builder__iframe-full-bleed"
        name="keystone-iframe"
        data-iframe>
      </iframe>
    </div>
    <div class="page-builder__iframe-container" v-if="moduleId && moduleOpen">
      <iframe
      :src="`${pageOrigin}/keystone/${moduleName}/${moduleId}`"
      class="page-builder__iframe-full-bleed"
      name="keystone-iframe"
      data-iframe>
      </iframe>
    </div>
    <div v-if="pageId && pageOpen === false && moduleOpen === false" class="page-builder__modules-wrapper">
      <div class="page-builder__modules page-builder__modules-first">
        <h6 class="page-builder__modules-label">
          Page information, click to edit
        </h6>
        <ul class="page-builder__modules-list">
            <li class="page-builder__modules-list-item">
              <div class="page-builder__modules-list-left">
                <router-link
                  :to="{path: '/page-builder/tree', query: { pageId: pageId, pageOpen: true}}" 
                  tag="h1" class="page-builder__page-title">
                  <badge :text="badgeText(pageData.__v)" /> {{(moduleEditName) ? moduleEditName : pageData.name}}
                </router-link>
              </div>
              <action-button 
                :id="pageData._id" 
                :confirmClick="removePage" 
                classAddition="btn__module-list" 
                tooltipMsg="Click again to remove" 
                icon="delete" 
                iconColor="#FF005E"
              ></action-button>
            </li> 
        </ul>
      </div>
      <div class="page-builder__modules">
        <h6 class="page-builder__modules-label">
          Modules on this page, drag and drop to arrange
        </h6>
        <ul class="page-builder__modules-list" v-if="moduleData">
          <draggable class="module-wrapper" 
            v-model="moduleData"
            style="min-height:25px;">

            <li v-for="(module, index) in moduleData" v-bind:key="module.data[0]._id"
                class="page-builder__modules-list-item" :style="{zIndex:(moduleData.length - index) + 1}">
              <div class="page-builder__modules-list-left">
                <router-link 
                :to="{path: `/page-builder/tree/`, query: {pageId: pageId, moduleId: module.data[0]._id, moduleName: modulePluralized(module.moduleName), moduleOpen: true}}"
                tag="div" class="page-builder__modules-list-title">
                  <badge :text="badgeText(module.data[0])" /><badge :text="module.moduleName" />{{module.data[0].name}}
                </router-link>
              </div>
              <action-button 
                :id="module.data[0]._id" 
                :confirmClick="removeModule" 
                :classAddition="`btn__module-list ${roundCorner(index)}`" 
                tooltipMsg="Click again to remove" 
                icon="delete" 
                iconColor="#FF005E"
              ></action-button>
            </li> 
          </draggable>
        </ul>
        <add-module></add-module>
      </div>
    </div>  
  </div>
</template>

<script src="./PageBuilder.js"></script>
<style src="./PageBuilder.scss"></style>