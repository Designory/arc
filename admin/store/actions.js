import universalUtils from '../../utils/universal';
import router from '../router';

export default {
	
	SOCKET_TREECHANGE({ dispatch, commit, state }, payload) {
		
		payload = payload[0] || payload; // don't know why the socket puts this into an array 

		console.log(payload);

		// we only want to make the update when the updating page is open 
		if (payload._id !== state.route.query.pageId) return false;

		// funny enough, we might not need to worry about {lang}, 
		// although we include it in the payload
		

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
				let newObject = payload.tree[item];
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
		
		// NOTE: need to add lang aspect

		payload = payload[0] || payload; // don't know why the socket puts this into an array 
		

		// only continue if the user has the current module
		//if (!state.route.query || !state.route.query.pageId || state.route.query.pageId !== payload._id) return false;

		// if message value is an array, straight replace
		//if (Array.isArray(payload.modules) && state.route.query.pageId !== payload._id) {
		if (Array.isArray(payload.modules)) {

			commit('UPDATE_MODULE', payload.modules);
	      	
		// if payload in an object, assume hash, and replace only 
		// what's in the hash object

		} else if (!Array.isArray(payload.modules)) {

			let moduleIsOnPage = false;
			const payloadIds = Object.keys(payload.modules);
			[...state.currentModulesData].forEach(item => {
				if (payloadIds.includes(item._id)) moduleIsOnPage = true;
			});

			if (moduleIsOnPage) {

				state.route.query.pageId !== payload._id

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
				
			}

			commit('UPDATE_MODULE', newArr);
		
		} else {
			console.log('lost it all');
		}

		if (state.route.query && Object.keys(payload.modules).includes(state.route.query.moduleId)) router.replace({query:{pageId:state.route.query.pageId}});

	},

	SOCKET_LOCKTREE({ dispatch, commit, state }, payload) {
		console.log(typeof payload, ' -- ', payload);
	}
}
