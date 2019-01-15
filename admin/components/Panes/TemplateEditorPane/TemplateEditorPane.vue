<template>
  <div class="template-pane">
    <div class="template-pane__title">
      {{listName}}
    </div>
    <div class="template-pane__bottom">
      <button v-on:click="addNewItem" class="btn btn--small btn--blue" data-create-item-btn>             
        Add New Item
      </button>
    </div>
    <div class="template-pane__search">
      <input v-model="searchInput" v-on:keyup="searchHandler" type="text" class="template-pane__search-bar" placeholder="Search List...">
    </div>
    <ul class="template-pane__list">
      <router-link
        tag="li" 
        :to="{ path: `/template-view/${listName}`, params: { listName: listName}, query: { moduleId: item._id }}"
        class="template-pane__list-item"
        v-for="item in list" :key="item._id"
        data-list-item>
        {{item.name}}
      </router-link> 
    </ul>
    <div class="template-pane__form-container template-pane__form-container--hidden" data-form-container>
        <form class="template-pane__form" v-on:submit.prevent="createNewItem">
          <input type="text" class="template-pane__search-bar" placeholder="Module Name" data-name-field>
          <button type="submit" class="btn btn--small template-pane__form-button">Create New Item</button>
        </form>
    </div>
  </div>
</template>

<script src="./TemplateEditorPane.js"></script>
<style src="./TemplateEditorPane.scss"></style>