<template>
  <div class="template-editor" v-if="moduleId">
    <div class="template-editor__top">
      <div class="template-editor__title">
        {{moduleName}}
      </div>
      <div>
        <button class="btn btn--small btn--green">
          Publish Changes
        </button>
      </div>
    </div>
    <iframe
      :src="`${pageOrigin}/keystone/stg-${listName}/${moduleId}`"
      class="template-editor__iframe" 
      name="keystone-iframe"
      data-iframe>
    </iframe>
  </div>
</template>

<style src="./TemplateEditor.scss"></style>
<script src="./TemplateEditor.js"></script> 