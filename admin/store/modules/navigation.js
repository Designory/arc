const axios = require('axios');

// initial state
const state = {
	status: null,
	type: 'page',
	page: null,
	pages: [],
	modules: [],
	previous: null
};

const actions = {
	set_page({ commit, dispatch }, pageId) {
		commit('set_status', 'loading');
		axios
			.get(`/arc/api/page/${pageId}`)
			.then(response => response.data)
			.then(page => {
				if (!page) commit('set_status', 'error');
				commit('set_status', 'loaded');
				commit('set_page', page.data);

				// grab the page data code
				if (page.data.pageDataCode) {
					dispatch('fetchPageModules', page.data.pageDataCode);
				}
			});
	},
	fetchPages({ commit }) {
		// set loading state
		commit('set_status', 'loading');

		axios
			.get('/arc/api/page')
			.then(response => response.data)
			.then(pages => {
				const status = !pages ? 'error' : 'loaded';
				commit('set_status', status);
				commit('set_pages', pages.data);
			});
	},
	fetchModules({ commit }) {
		commit('set_status', 'loading');

		axios
			.get('/arc/api/page/')
			.then(response => response.data)
			.then(modules => {
				const status = !modules ? 'error' : 'loaded';
				commit('set_status', status);
				commit('set_modules', modules.data);
			});
	},
	fetchPageModules({ commit }, payload) {
		if (payload) {
			const arrayOfModules = JSON.parse(payload);
			const moduleTypeObj = {};

			arrayOfModules.forEach(moduleObject => {
				const moduleType = moduleObject.moduleName.toLowerCase();
				const [itemId] = moduleObject.itemIds;

				if (moduleTypeObj[moduleType] !== undefined) {
					moduleTypeObj[moduleType].push(itemId);
				} else {
					moduleTypeObj[moduleType] = [];
					moduleTypeObj[moduleType].push(itemId);
				}
			});

			const modulePromises = Object.keys(moduleTypeObj).map(moduleType => {
				const stringOfModules = moduleTypeObj[moduleType].toString();
				// return axios.get(`/arc/api/${moduleType}/multiple?ids=${stringOfModules}`);

				return `/arc/api/${moduleType}/multiple?ids=${stringOfModules}`;
			});

			// console.log(modulePromises);

			// Promise.all(modulePromises).then(responses => {
			// 	console.log(responses);
			// });
		}
	}
};

const mutations = {
	set_status(context, status) {
		context.status = status;
	},
	set_pages(context, pages) {
		context.pages = pages;
	},
	set_page(context, page) {
		context.page = page;
	},
	set_modules(context, modules) {
		context.modules = modules;
	}
};

export default {
	namespaced: true,
	state,
	actions,
	mutations
};
