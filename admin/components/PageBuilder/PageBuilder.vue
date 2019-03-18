<template>
  <div class="page-builder" :class="{deleting: pageData._deleting}" v-if="pageData"  :style="(pageOpen || moduleOpen) ? { background:'#fafafa'} : {}">
    <div class="page-builder__top" :style="(pageOpen || moduleOpen) ? { background:'#fafafa'} : {}">
      <div class="page-builder__top-left">
        <action-button 
          v-if="pageOpen || moduleOpen" 
          :to="{ path: '/page-builder/tree', query: { pageId: pageId}}" 
          text="Back"
          classAddition="back">  
        </action-button>
      </div>
      <div class="page-builder__top-right" v-if="!pageOpen && !moduleOpen"> 
        <button class="btn primary" @click="publishPage()">
          Publish Page
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
                <router-link
                  :to="{path: '/page-builder/tree', query: { pageId: pageId, pageOpen: true}}" 
                  tag="li">Edit
                </router-link>
                <li v-if="pageData.existsOnLive" @click="unPublishPage()">Hide on live site</li>
                <li @click="publishPage()">Publish to live site</li>
                <li>Make a copy</li>
                <div class="spacer"></div>
                <action-button
                  :id="pageData._id" 
                  :confirmClick="removePage"
                  text="Delete"
                  classAddition="no-style"
                  confirmText="Confirm Delete">  
                </action-button>
              </ul>
            </div>
          </div>
          <div class="page-builder__cell page-builder__pill">
            <pill :text="getStatusText(pageData)" :color="getStatus(pageData)"  />
          </div>
        </div>
        <p>
            <a :href="previewUrl" target="_blank">{{pageData.url}}</a>
          </p>
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
                {{(moduleData && moduleData.length) ? 'Modules on this page' : 'No module on this page yet'}}
              </h6>
            </div>

            <div class="page-builder__cell page-builder__cell--no-border page-builder__cell--width-auto">
                <button @click="toggleAddModule()" class="page-builder__add-module" :class="{active:addModulesList}">{{(moduleData && moduleData.length) ? 'CREATE NEW MODULE' : 'CREATE FIRST MODULE'}}</button>
            </div>
          </div>
          
          <div class="page-builder__filmstrip-wrapper" :class="{active:addModulesList}" ref="filmstripWrapper">
            <ul class="page-builder__filmstrip">
              <li v-for="(module, index) in availableModules" @click="createAndAddModule(module)" class="page-builder__module-thumbnail">
                <div class="page-builder__module-thumbnail-visual" v-html="module.svg || ''"></div>
                <div class="page-builder__module-thumbnail-label">
                  {{module.label || module._listName}}
                </div>
              </li>
            </ul>
          </div>
        
        </div>
        
        <div class="page-builder__subhead" v-if="moduleData && moduleData.length">
          Drag modules to reorder
        </div>
        <ul class="page-builder__modules-list" ref="moduleWrapper" v-if="moduleData">
          <draggable class="module-wrapper" 
            v-model="moduleData"
            style="min-height:25px;">

            <li v-for="(module, index) in moduleData" ref="module" :key="module._id"
                class="page-builder__modules-list-item" :style="{zIndex:(moduleData.length - index) + 1}">
              <div class="page-builder__row">
                <div class="page-builder__cell page-builder__type" >
                  {{module._listName}}
                </div>
                <div class="page-builder__cell page-builder__title" >
                  <router-link 
                    :to="{path: `/page-builder/tree/`, query: {pageId: pageId, moduleId: module._id, moduleName: modulePluralized(module._listName), moduleOpen: true}}"
                    tag="div" class="page-builder__modules-list-title">
                    <span class="page-builder__title--text">{{module.name}}</span>
                  </router-link>
                </div>
                <div @click="showContext(module._id, $event)" class="page-builder__cell page-builder__edit-control" :class="{active:contextActive === module._id}">
                  <div class="page-builder__edit-icon"></div>
                  <div v-if="contextActive === module._id" class="context-menu context-from-button" :class="contextPosition">
                    <ul>
                      <router-link :to="{path: `/page-builder/tree/`, query: {pageId: pageId, moduleId: module._id, moduleName: modulePluralized(module._listName), moduleOpen: true}}" tag="li">
                        Edit
                      </router-link>
                      <li v-if="module.existsOnLive" @click="unPublishModule(module._listName, module._id)">Hide on live site</li>
                      <li v-if="!module.matchesLive" @click="publishModule(module._listName, module._id)">Publish to live site</li>
                      <li @click="duplicateAndAddModule(module._listName, module, index, $event)">Make a copy</li>
                      <div class="spacer"></div>
                      <action-button
                        :id="module._id" 
                        :confirmClick="removeModule"
                        text="Remove"
                        classAddition="no-style"
                        confirmText="Confirm Remove">  
                      </action-button>
                    </ul>
                  </div>
                </div>
                <div class="page-builder__cell page-builder__pill">
                  <pill :text="getStatusText(module)" :color="getStatus(module)" />
                </div>
              </div>
              <!-- <action-button 
                :id="module._id" 
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