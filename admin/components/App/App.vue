<template>
  <div
    id="app"
    class="arc-root">

    <Header />
    <!-- <transition name="fade"> -->  
      
    <!-- </transition> -->
    <!-- <transition name="fade"> -->
      <main class="arc-body" :class="$route.name">
        <router-view class="sidebar" name="navigation" />
        <router-view name="main" :key="$route.fullPath"/>
      </main>
    <!-- </transition> -->
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>