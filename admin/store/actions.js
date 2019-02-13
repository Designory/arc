import universalUtils from '../../utils/universal';
import router from '../router';

export default {
	
	SOCKET_TREECHANGE({ dispatch, commit, state }, payload) {
		
		payload = payload[0] || payload; // don't know why the socket puts this into an array 

	    // if message value is an array, straight replace
		if (Array.isArray(payload.tree)) {

			commit('tree', payload.tree);
	      
		// if message in an object, assume hash, and replace only 
		// what's in the hash object
		} else {
	        
			let updatedIds = Object.keys(payload.tree);
	        
			const newArr = _.cloneDeep(state.tree).map(item => {
	          	
	          	// update tree by hash prop
				if (payload.tree[item._id]) {
	            
					if (payload.tree[item._id]._delete) return null;

					for (let key in payload.tree[item._id]) {
						item[key] = payload.tree[item._id][key];
					}

					updatedIds = _.without(updatedIds, item._id);

				}
	          
				return item;
	        
			}).filter(item => {return item !== null});

			updatedIds.forEach(item => {
				let newObject = payload[item];
				newObject._id = item;
				newArr.push(newObject);
			});

			commit('UPDATE_TREE', _.sortBy(newArr, 'sortOrder'));

		}

	},
	SOCKET_PAGECHANGE({ dispatch, commit, state }, payload) {
		
		payload = payload[0] || payload; // don't know why the socket puts this into an array 

		// this is designed for multiple page updates
		// for future scalability 
		for (let key in payload) {

			// update currently viewed page
			if (state.route.query.pageId === key) {
				
				if (payload[key]._delete) commit('UPDATE_PAGE', '');
				else commit('UPDATE_PAGE', payload[key]);
				
				// close all open editor views for this updated page
				if (state.route.query && state.route.query.pageOpen) router.replace({query: Object.assign({}, state.route.query, {pageOpen: false})});
				
				// remove all ghost elements for this page
				commit('MODULE_GHOST', false);

			}

			// pass along to ensure the tree takes the proper update as well
			dispatch('SOCKET_TREECHANGE', {
				tree: {
					[key]:payload[key]
				}
			});
		}

	},

	SOCKET_MODULECHANGE({ dispatch, commit, state }, payload) {
		
		payload = payload[0] || payload; // don't know why the socket puts this into an array 

		// only continue if the user have the current page selected
		if (!state.currentModulesData) return false;

		//console.log(state.currentModulesData)

		let inCurrentModule = false;
		for (let key in payload) {
			if (state.currentModulesData.some(item => item._id === key)) {
				inCurrentModule = true;
				break;
			}
		}
		if (inCurrentModule) return false;

		// if message value is an array, straight replace
		if (Array.isArray(payload.modules)) {

			commit('UPDATE_MODULE', payload.modules);
	      
		// if payload in an object, assume hash, and replace only 
		// what's in the hash object
		} else {

			const newArr = _.cloneDeep(state.currentModulesData);
			let updatedIds = Object.keys(payload.modules);

			// update/delete existing items
			newArr.map(item => {
				
				for (let key in payload.modules) {
					if (item._id === key && payload.modules[key]._delete) item == null;
					else if (item._id === key) {
						
						item = {
							data:[Object.assign({}, item, payload.modules[key])],
							moduleName:item._listName
						}
						
						updatedIds = _.without(updatedIds, item._id);

					} 
				}

				return item;

			}).filter(item => {return item !== null});

			// add new items
			updatedIds.forEach(item => {
				
				let newObject = payload.modules[item];
				newObject._id = item;
				
				if (newObject._insertAfter) {
					
					const index = newArr.findIndex(module => module._id === newObject._insertAfter);
					
					newArr.splice(index, 0, {
						data: [newObject],
						moduleName: newObject._listName
					});

				} else {
					
					newArr.push({
						data: [newObject],
						moduleName: newObject._listName
					});
				
				}	

			});

			commit('UPDATE_MODULE', newArr);
		
		}
		if (state.route.query && state.route.query.moduleOpen) router.replace({query: Object.assign({}, state.route.query, {moduleOpen: false})});

	}
}
