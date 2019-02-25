<template>
  <span v-if="text" :class="`pill ${color || ''}`">{{text}}</span>
</template>

<!-- :to="to" -->

<script src="./Pill.js"></script>
<style src="./Pill.scss"></style>