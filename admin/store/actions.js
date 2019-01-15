import axios from 'axios';

export default {
	route_change({ dispatch, commit, state }, payload) {
		const mapObj = {
			panel: {
				src: 'controlPanels',
				mutation: 'CHANGE_PANEL'
			},
			page: {
				src: 'currentPage',
				mutation: 'CHANGE_PAGE'
			}
		};

		for (let key in payload.to.params) {
			if (!mapObj[key]) continue;
			let stateKey = mapObj[key].src;
			let mutationKey = mapObj[key].mutation;
			let paramValue = payload.to.params[key];

			if (stateKey === 'controlPanels') {
				state[stateKey].forEach(item => {
					if (item.id === paramValue) commit(mutationKey, item);
				});
			}

			if (stateKey === 'currentPage') {
				dispatch('change_page', paramValue);
			}
		}

		commit('SET_APPLICATION', payload.to.params.application);
	},

	get_applications({ commit, state }) {
		axios
			.get(`${state.pathRoot}/arc-api/list/StgApplication`)
			.then(response => {
				commit('GET_APPLICATIONS', response.data);
				if (state.route.params.application) commit('SET_APPLICATION', state.route.params.application);
			})
			.catch(error => {
				console.log(error);
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	get_list({ commit, state }, payload) {
		axios
			.get(`${state.pathRoot}/arc-api/list/${payload}`)
			.then(response => {
				commit('GET_LIST', response.data);
				console.log('new data -> ', response.data);
			})
			.catch(error => {
				console.log(error);
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	change_page({ commit, state }, payload) {
		axios
			.get(`${state.pathRoot}/arc-api/list/StgPage/${payload}`)
			.then(response => {
				commit('CHANGE_PAGE', response.data);

				commit('CHANGE_CATEGORY', response.data.categor);

				commit('SET_PAGE_MODULES', response.data.modules);
			})
			.catch(error => {
				console.log(error);
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	get_module_types({ commit, state }) {
		setTimeout(() => {
			commit('CHANGE_PANEL', state.controlPanels[1]);
		}, 1000);
	},

	normalize_module_after_drag({ commit, state, dispatch }) {
		const payload = state.currentDraggable;

		const pageDataCode = {
			itemIds: [payload],
			moduleName: state.listName
		};

		commit('ADD_MODULE_TO_PAGE', pageDataCode);
		dispatch('set_module_order', state.currentPageModules);
	},

	set_module_order({ commit, state }, payload) {
		commit('SET_PAGE_MODULES', payload);

		const pageDataCode = payload.map(item => {
			if (!item.itemIds[0]) return false;

			return {
				itemIds: [item.itemIds[0]._id],
				moduleName: item.moduleName
			};
		});

		pageDataCode.filter(item => item !== false);

		axios
			.post(`${state.pathRoot}/arc-api/post/StgPage/${state.currentPage._id}`, {
				pageDataCode: JSON.stringify(pageDataCode),
				category: state.latestCategory
			})
			.catch(error => {
				console.log(error);
				// refresh the screen when there is an authorization error
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	post_to_database({ dispatch, commit }, payload) {
		(function (commit, dispatch, payload) {
			if (!payload || !payload.data || !payload.data._id || !payload.data.collection)
				return console.log(
					'Error: Unable to post to database. Necessary data was not passed to "post_to_database" action.'
				);

			let postUrl = payload.data._id
				? `${state.pathRoot}/arc-api/post/${payload.data.collection}/${payload.data._id}`
				: `${state.pathRoot}/arc-api/post/${payload.data.collection}`;

			axios
				.post(postUrl, payload.data)
				.then(response => {
					if (payload.data.collection == 'StgPage') {
						dispatch('get_navigations');
						commit('CHANGE_PAGE', response.data);
						commit('SET_PAGE_MODULES', response.data.modules);
					}

					if (payload.callback) payload.callback(response);
				})
				.catch(error => {
					console.log(error);
					// refresh the screen when there is an authorization error
					if (error.response.status === 401 || error.response.status === 403) {
						window.location.reload(false);
					}
				});
		})(commit, dispatch, payload);
	},

	get_navigations({ commit }, siteSection) {
		const uri = siteSection
			? `${state.pathRoot}/arc-api/navigation/${siteSection}`
			: `${state.pathRoot}/arc-api/navigation`;

		axios
			.get(uri)
			.then(response => {
				commit('UPDATE_TREE', response.data);
			})
			.catch(error => {
				console.log(error);
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	set_navigation_order({ commit }, tree) {
		const postArr = [];

		// reduce payload to send to server
		for (let i = 0, ilen = tree.items.length; i < ilen; i++) {
			const chapterId = tree.items[i]._id;
			const pageArr = [];

			// in the future, we need to make this recursive to handle
			for (let x = 0, xlen = tree.items[i].children.length; x < xlen; x++) {
				pageArr.push(tree.items[i].children[x]._id);
			}

			postArr.push({
				id: chapterId,
				children: pageArr
			});
		}

		axios
			.post(`${state.pathRoot}/arc-api/sort-navigation`, { items: postArr })
			.then(response => {
				console.log('Navigation order updated (both staging and production)');
			})
			.catch(error => {
				console.log(error);

				// refresh the screen when there is an authorization error
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	get_meta({ commit }) {
		const uri = `/arc-api/list/Meta/`;
		axios
			.get(uri)
			.then(response => {
				// always get first value of Meta
				const metaResponse = !response.data ? response.data : response.data[0];
				commit('UPDATE_META', metaResponse);
			})
			.catch(error => {
				console.log(error);
				// refresh the screen when there is an authorization error
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	get_module_list({ commit }, list, id) {
		const uri = id
			? `${state.pathRoot}/arc-api/list/${list}/${id}`
			: `${state.pathRoot}/arc-api/list/${list}`;

		axios
			.get(uri)
			.then(response => {
				const treeData = !response.data.id
					? response.data.map(item => {
						item.pages = item.relatedPages.length ? item.relatedPages : item.referencePage;
						return item;
					})
					: response.data;

				commit('UPDATE_AVAIL_MODULES', treeData, id);
			})
			.catch(error => {
				console.log(error);

				// refresh the screen when there is an authorization error
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	fill_module_list({ commit }, moduleList) {
		const moduleType = `Stg${moduleList.title}`;
		const uri = `${state.pathRoot}/arc-api/list/${moduleType}/`;
		axios
			.get(uri)
			.then(response => {
				if (response.data) {
					const eachItem = response.data;
					commit('FILL_MODULE_LIST', eachItem);
				}
			})
			.catch(error => {
				console.log(error);

				// refresh the screen when there is an authorization error
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	},

	get_module_type_list({ commit }) {
		// call to arc modules
		const uri = `${state.pathRoot}/arc-api/list/stg-arc-modules`;
		axios
			.get(uri)
			.then(response => {
				commit('LOAD_MODULE_TYPES', response.data);
			})
			.catch(error => {
				console.log(error);

				// refresh the screen when there is an authorization error
				if (error.response.status === 401 || error.response.status === 403) {
					window.location.reload(false);
				}
			});
	}
};
