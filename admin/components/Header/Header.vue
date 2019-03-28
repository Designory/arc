<template>
  <header class="arc-header">
    <div class="arc-header__left">
      <router-link class="arc-header__logo" tag="a" to="/">
        Arc
      </router-link> 
    </div>
    <div class="arc-header__right">
      <!-- <button v-on:click="showBuildModal" class="btn btn--white btn--small">
        Build
      </button> -->
      <div v-if="langs.length && activeLang" @click="langSelectActive = !langSelectActive" class="arc-header__lang-select" :class="{active:langSelectActive}">
        <div class="">{{activeLang.label}}</div>
          <div v-if="langSelectActive" class="context-menu context-from-select">
          <ul>
            <li v-for="lang in langs" @click="changeLang(lang)">{{lang.label}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div class="arc-header__build-modal-container" v-on:click="closeBuildModal" data-build-modal>
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
      </div> -->
    </div>
  </header>
</template>

<script src="./Header.js"></script>
<style src="./Header.scss"></style>

