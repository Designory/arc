<template>
  <form class="add-module">
    <div class="add-module__input_wrapper">
      <input class="add-module__name" v-model="name" placeholder="My new module" />
    </div>
    <div class="add-module__input_wrapper">
      <select class="add-module__type" v-model="type">
        <option value="" selected></option>
        <option v-for="type in moduleTypes" :value="type.listName">{{type.label || type.listName}}</option>
      </select>
    </div>
    <div class="add-module__input_wrapper">
      <button @click="addModule" class="btn" :disabled="!name || !type">
          Add
      </button>
    </div>
  </form>
</template>

<script src="./AddModule.js"></script>
<style src="./AddModule.scss"></style>