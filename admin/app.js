import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import socketio from 'socket.io-client';
import vueSocket from 'vue-socket.io';

Vue.config.devtools = true;

import App from './components/App/App.vue';
import router from './router';
import store from './store';

const socketInstance = socketio(window.location.origin);

Vue.use(vueSocket, socketInstance, store);

sync(store, router);

const app = new Vue({
	router,
	store,
	...App
});

app.$mount('#arc');
