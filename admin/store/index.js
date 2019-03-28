import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// relative imports
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';
import navigation from './modules/navigation';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
	modules: {
		navigation
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
});
