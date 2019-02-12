<template>
  <div class="page-builder" v-if="pageData" :style="(pageOpen) ? {background:'#fafafa'} : ''">
    <div class="page-builder__top">
      <div class="page-builder__top-left">
        <action-button v-if="pageOpen || moduleOpen" :to="{ path: '/page-builder/tree', query: { pageId: pageId}}" text="Back"></action-button>
      </div>
      <div class="page-builder__top-right" v-if="!pageOpen || !moduleOpen"> 
        <button class="btn primary">
          Publish Page
        </button>
        <a :href="previewUrl" target="_blank" class="btn secondary">
          Preview on Stage
        </a>
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
    <div v-if="pageId && pageOpen === false && moduleOpen === false">
      
      <div class="page-builder__page">
        <div class="page-builder__subhead">
          Click to edit general page information
        </div>
        <div class="page-builder__row">
          <div class="page-builder__cell page-builder__title" >
            <router-link
              :to="{path: '/page-builder/tree', query: { pageId: pageId, pageOpen: true}}" 
              tag="span" class="page-builder__title--text">{{(moduleEditName) ? moduleEditName : pageData.name}}
            </router-link>
          </div>
          <div @click="showContext(pageData._id, $event)" :class="{active:contextActive === pageData._id}" class="page-builder__cell page-builder__edit-control">
            <div class="page-builder__edit-icon"></div>
            <div v-if="contextActive === pageData._id" class="context-menu context-from-button" :class="contextPosition">
              <ul>
                <li>Edit</li>
                <li>Hide on live site</li>
                <li>Make a copy</li>
                <div class="spacer"></div>
                <li>Delete</li>
              </ul>
            </div>
          </div>
          <div class="page-builder__cell page-builder__pill">
            <pill :text="getStatusText(pageData)" :color="getStatus(pageData)"  />
          </div>
        </div>
      </div>

      <div class="page-builder__modules page-builder__modules-first">
        
        <!-- <ul class="page-builder__modules-list">
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
        </ul>-->
      </div>
      <div class="page-builder__modules">
        <div class="page-builder__modules-header">
          <div class="page-builder__row">
            <div class="page-builder__cell page-builder__cell--no-border">
              <h6 class="page-builder__modules-title">
                Modules on this page
              </h6>
            </div>

            <div class="page-builder__cell page-builder__cell--no-border page-builder__cell--width-auto">
                <button @click="toggleAddModule()" class="page-builder__add-module" :class="{active:addModulesList}">CREATE NEW MODULE</button>
            </div>
          </div>
          
          <div class="page-builder__filmstrip-wrapper" :class="{active:addModulesList}">
            <ul class="page-builder__filmstrip">
              <li v-for="(module, index) in availableModules" @click="createAndAddModule(module)" class="page-builder__module-thumbnail">
                <div class="page-builder__module-thumbnail-visual" v-html="module.svg || ''"></div>
                <div class="page-builder__module-thumbnail-label">
                  {{module.label || module.listname}}
                </div>
              </li>
            </ul>
          </div>
        
        </div>
        
        <div class="page-builder__subhead">
          Drag modules to reorder
        </div>
        <ul class="page-builder__modules-list" v-if="moduleData">
          <draggable class="module-wrapper" 
            v-model="moduleData"
            style="min-height:25px;">

            <li v-for="(module, index) in moduleData" v-bind:key="module.data[0]._id"
                class="page-builder__modules-list-item" :style="{zIndex:(moduleData.length - index) + 1}">
              <div class="page-builder__row">
                <div class="page-builder__cell page-builder__type" >
                  {{module.moduleName}}
                </div>
                <div class="page-builder__cell page-builder__title" >
                  <router-link 
                    :to="{path: `/page-builder/tree/`, query: {pageId: pageId, moduleId: module.data[0]._id, moduleName: modulePluralized(module.moduleName), moduleOpen: true}}"
                    tag="div" class="page-builder__modules-list-title">
                    {{module.data[0].name}}
                  </router-link>
                </div>
                <div @click="showContext(module.data[0]._id, $event)" class="page-builder__cell page-builder__edit-control" :class="{active:contextActive === module.data[0]._id}">
                  <div class="page-builder__edit-icon"></div>
                  <div v-if="contextActive === module.data[0]._id" class="context-menu context-from-button" :class="contextPosition">
                    <ul>
                      <router-link :to="{path: `/page-builder/tree/`, query: {pageId: pageId, moduleId: module.data[0]._id, moduleName: modulePluralized(module.moduleName), moduleOpen: true}}" tag="li">
                        Edit
                      </router-link>
                      <li>Hide on live site</li>
                      <li>Make a copy</li>
                      <div class="spacer"></div>
                      <li>Delete</li>
                    </ul>
                  </div>
                </div>
                <div class="page-builder__cell page-builder__pill">
                  <pill :text="getStatusText(module.data[0])" :color="getStatus(module.data[0])" />
                </div>
              </div>
              <!-- <action-button 
                :id="module.data[0]._id" 
                :confirmClick="removeModule" 
                :classAddition="`btn__module-list ${roundCorner(index)}`" 
                tooltipMsg="Click again to remove" 
                icon="delete" 
                iconColor="#FF005E"
              ></action-button> -->
            </li> 
          </draggable>
        </ul>
      </div>
    </div>  
  </div>
</template>

<script src="./PageBuilder.js"></script>
<style src="./PageBuilder.scss"></style>