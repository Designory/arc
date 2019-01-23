import Vue from 'vue';
import { sync } from 'vuex-router-sync';
//import socketio from 'socket.io-client';
import vueSocket from 'vue-socket.io';

Vue.config.devtools = true;

import App from './components/App/App.vue';
import router from './router';
import store from './store';

//const socketInstance = socketio(window.location.origin);

sync(store, router);

//Vue.use(vueSocket, socketInstance, store);
Vue.use(new vueSocket({
    debug: true,
    connection: window.location.origin,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}));

const app = new Vue({
	router,
	store,
	...App
});

app.$mount('#arc');
