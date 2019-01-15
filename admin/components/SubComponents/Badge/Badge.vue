<template>
  <span v-if="text" :class="`badge ${color || ''}`">{{text}}</span>
</template>

<!-- :to="to" -->

<script src="./Badge.js"></script>
<style src="./Badge.scss"></style>