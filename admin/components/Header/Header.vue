<template>
  <header class="arc-header">
    <div class="arc-header__left">
      <router-link class="arc-header__logo" tag="a" to="/">
        Arc
      </router-link> 
    </div>
    <div class="arc-header__right">
      <button v-on:click="showBuildModal" class="btn btn--white btn--small">
        Build
      </button>
    </div>
    <div class="arc-header__build-modal-container" v-on:click="closeBuildModal" data-build-modal>
      <div class="arc-header__build-modal">
        <div class="arc-header__build-modal-title">
          Build
          <button v-on:click="closeBuildModal" data-close-button 
                  class="arc-header__build-modal-close btn btn--red btn--small">
            X
          </button>
        </div>
        <div class="arc-header__build-modal-body">
          Build information will go here
        </div>
      </div>
    </div>
  </header>
</template>

<script src="./Header.js"></script>
<style src="./Header.scss"></style>

