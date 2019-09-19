<template>
  <div class="template-editor list-editor">
    <iframe
      :src="`${pageOrigin}/keystone/${list}`"
      class="list-editor__iframe" 
      name="keystone-iframe"
      ref="list-iframe">
    </iframe>
  </div>
</template>

<style src="./ListMain.scss"></style>
<script src="./ListMain.js"></script> 