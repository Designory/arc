<template>
  <div
    id="app"
    class="arc-root" >
    <Header />
    <!-- <transition name="fade"> -->
      <router-view class="sidebar" name="navigation" />
    <!-- </transition> -->
    <!-- <transition name="fade"> -->
      <main class="arc-body">
        <router-view name="main" :key="$route.fullPath"/>
      </main>
    <!-- </transition> -->
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>