<template>
  <div class="page-builder-controls">
    <ul class="page-builder-controls__controls">
      <router-link class="page-builder-controls__controls-item" tag="li" :to="{path: `/${$store.getters.getLangPath}/page-builder/tree`, query: {pageId: this.$route.query.pageId}}">
        Site Structure
      </router-link>
      <router-link class="page-builder-controls__controls-item" tag="li" :to="{path: `/${$store.getters.getLangPath}/page-builder/modules`, query: {pageId: this.$route.query.pageId}}">
        Modules
      </router-link>
    </ul>
  </div>
</template>

<style src="./PageBuilderControls.scss"></style>