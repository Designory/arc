<template>
  <header class="arc-header">
    <div class="arc-header__left">
      <router-link class="arc-header__logo" tag="a" :to="`/${activeLang.path}`">
       {{!hideBackArrow ? '&larr; ' : ' '}} Arc
      </router-link> 
      <span class="arc-header__breadcrumb" v-if="backToListVisible"> / <span @click="goBack()">back to list</span></span>
    </div>
    <div class="arc-header__right">
      <div v-if="langs.length && activeLang" @click="langSelectActive = !langSelectActive" class="arc-header__lang-select" :class="{active:langSelectActive}">
        <div class="">{{activeLang.label}}</div>
          <div v-if="langSelectActive" class="context-menu context-from-select">
          <ul>
            <li v-for="lang in langs" @click="changeLang(lang)" :class="{active: lang.path === activeLang.path}">{{lang.label}}</li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script src="./Header.js"></script>
<style src="./Header.scss"></style>

