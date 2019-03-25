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
	            
	            	updatedIds = _.without(updatedIds, item._id);

					if (payload.tree[item._id]._delete) {
						item = null;
					} else {
						for (let key in payload.tree[item._id]) {
							item[key] = payload.tree[item._id][key];
						}	
					}

				}
	          
				return item;
	        
			}).filter(item => {return item !== null});

			updatedIds.forEach(item => {
				
				//console.log(item);
				

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
		
		if (!state.currentModulesData) return false;
		
		// only continue if the user has the current page selected
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

			let newArr = [];
			let updatedIds = Object.keys(payload.modules);

			// update/delete existing items
			[...state.currentModulesData].forEach(item => {
				
				const itemId = item._id;
				let update = item;

				for (let key in payload.modules) {
					
					if (itemId === key) { 
						
						if (payload.modules[key]._delete) update = null;
						else item = update = payload.modules[key];				
						updatedIds = _.without(updatedIds, itemId);

					} 
				}

				newArr.push(update);

			});

			newArr = newArr.filter(item => {return item !== null});

			// add new items
			updatedIds.forEach(item => {
				
				let newObject = payload.modules[item];
				newObject._id = item;
				
				if (newObject._insertAfter) {
					
					const index = newArr.findIndex(module => module._id === newObject._insertAfter);
					
					newArr.splice(index, 0, newObject);

				} else {
			
					newArr.push(newObject);	
				
				}	

			});

			commit('UPDATE_MODULE', newArr);

			if (state.route.query && Object.keys(payload.modules).includes(state.route.query.moduleId)) router.replace({query:{pageId:state.route.query.pageId}});
		
		}

		

	}
}
