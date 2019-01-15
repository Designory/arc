
module.exports = (app, arc) => {
	const importRoutes = arc.importer(__dirname);

	const routes = {
		middleware: importRoutes('./middleware'),
	};

	// this should be the very last of all routes to be registered
	app.use(
		routes.middleware.getCurrentUrl,
		routes.middleware.getNavigationTree,
		routes.middleware.getCurrentPage,
		routes.middleware.populateModules,
		routes.middleware.renderPage
	);	
}

// 		console.log(req.ip);		

// 		var view = new arc.View(req, res),
// 			locals = res.locals,
// 			pageurl = (req.originalUrl !== '/') ? req.originalUrl : '/home';
// 			pageurl = pageurl.split('?')[0];

// 			if (pageurl == '/home') {
// 				locals.noNav = true;
// 				locals.noNavBottom = true;
// 			}

// 		view.on('init', function(next) {

// 			let query = arc.list(arc.keystonePublish.getList('Page')).model.find()
// 				.where('state', 'published')
// 				.sort('sortOrder')
// 				.lean()

// 			query.exec(function(err, results) {

// 				if (err) {
// 					console.log(err);
// 				}

// 				if (!results) {

// 					locals.currentPage = [];
// 					return res.redirect('/');
// 					//return res.notFound();
// 					next();

// 				} else {

// 					//return res.json(results);

// 					locals.pageUrl = pageurl;
// 					results = resultsUrlBuilder(results);
// 					locals.navigation = getTree(results, pageurl);
// 					locals.currentPage = getCurrentPage(locals.navigation, pageurl);

// 					if (!locals.currentPage) {
// 						locals.currentPage = [];
// 						return res.redirect('/');
// 						//return res.notFound();
// 						next();
// 					}

// 					let pagination = getPagination(results, locals.currentPage._id);

// 					locals.nextPage = pagination.next;
// 					locals.prevPage = pagination.prev;
// 					//locals.nextPage = z
// 					//console.log('locals.currentPage', locals.currentPage);

// 					var pageResults = consolidatePageDataCode(locals.currentPage.pageDataCode);

// 					if (pageResults) {

// 						flattenMap(arc, pageResults, function(data){

// 							locals.modules = data;

// 							console.log(data);

// 							next();

// 						}.bind(this), req.query);

// 					} else {

// 						locals.modules = [];

// 						next();

// 					}
// 				}
// 			});

// 			function consolidatePageDataCode(code){

// 				try {

// 					code = (typeof code == 'string') ? JSON.parse(code) : code;

// 					//
// 					// build the consolidated id array based on array siblings of the same 'moduleName' value
// 					//
// 					let currentHit;
// 					let currentHitIndex;
// 					let indexesToSkip = [];
// 					let newDataCode = [];

// 					for (let i = 0, len = code.length; i < len; i++) {
// 						// if the item is not a 'Value' just pass it through
// 						if (code[i].moduleName != 'Value') {
// 							newDataCode.push(code[i]);
// 							currentHit = null;
// 						} else {
// 							if (!currentHit) {
// 								currentHit = code[i].moduleName;
// 								currentHitIndex = i;
// 								newDataCode.push(code[i]);
// 							} else {
// 								code[currentHitIndex].itemIds.push(code[i].itemIds[0]);
// 							}

// 						}
// 					}

// 					return newDataCode;

// 				// return code;
// 				} catch(err){
// 					console.log(err, 'There was an error parsing JSON from pageDataCode. Please ensure this is valid JSON.');
// 					return code;
// 				}
// 			}

// 		});

// 		// // Render the view
// 		view.render('index');
// 	});

// };

// function resultsUrlBuilder(results){

// 	return results.filter(function(item){
//     	return (item.state === 'published' || item.state === 'visible');
// 	}).map(function(item, index, itemsArr){
// 		item.indentLevel = parseInt(item.indentLevel);
// 		item.listIndex = index;
// 		item.children = [];
// 		if (item.indentLevel === 1) item.url = '/' + item.key;
// 		else item.url = buildUrl(item, index, itemsArr);
// 		return item;
// 	});

// 	function buildUrl(item, index, itemsArr){
// 		let urlArr = [];

// 		urlArr.push(item.key);
// 		walkBack(item, index, itemsArr);

// 		function walkBack(item, index, itemsArr){
// 			let prevItem = itemsArr[index - 1];
// 			if (prevItem.indentLevel === 1) urlArr.push(prevItem.key);
// 			else {
// 				if (prevItem.indentLevel < item.indentLevel) urlArr.push(prevItem.key);
// 				walkBack(prevItem, index - 1, itemsArr);
// 			}
// 		}
// 		return '/' + urlArr.reverse().join('/');
// 	}

// }

// function getTree(pageList, pageurl){

// 	let rootPages = [];
// 	let highestLevel = 1;
// 	let pageurlArr = pageurl.substring(1).split('/');

// 	//console.log(pageurlArr);

// 	// fist, establish all the top level
//     let visiblePages = pageList.map(function(item, index, itemsArr){
// 		if (item.key === pageurlArr[0]) item.active = true;
// 		if (item.indentLevel === 1) rootPages.push(item);
// 		if (item.indentLevel > highestLevel) highestLevel = item.indentLevel;
// 		return item;
// 	});

// 	function getChildren(allPages, startIndex, level){
// 		let returnArr = [];
// 		for (let i = startIndex + 1, len = allPages.length; i < len; i++){
// 			if (allPages[i].indentLevel < level) break;
// 			if (allPages[i].indentLevel > level) continue;
// 			returnArr.push(allPages[i]);
// 		}
// 		return returnArr;
// 	}

// 	function drawTree(allPages, chapterPages, level){
// 		return chapterPages.map(function(page){
// 			let children = getChildren(allPages, page.listIndex, level);
// 			if (page.key == pageurlArr[level - 1]) page.active = true;
// 			if (children.length){
// 				let nextLevel = level + 1;
// 				page.children = (nextLevel < highestLevel) ? drawTree(allPages, children, nextLevel) : children.map(function(item){
// 					if (item.key === pageurlArr[level - 1]) item.active = true;
// 					return item;
// 				});
// 			}
// 			return page;
// 		});
// 	}

// 	return drawTree(visiblePages, rootPages, 2);

// }

// function getCurrentPage(treeData, pageurl){

// 	let pageurlArr = pageurl.substring(1).split('/');

// 	function findMatch(treeData, depthIndex){
// 		let directoryMatch = treeData.filter(function(page){
// 			return (pageurlArr[depthIndex] == page.key);
// 		})[0];
// 		if (!directoryMatch || !directoryMatch.key) return null;
// 		if (directoryMatch.children.length) return findMatch(directoryMatch.children, depthIndex + 1);
// 		else return directoryMatch;
// 	}
// 	return findMatch(treeData, 0);
// }

// function getPagination(flatList, currentPageId){

// 	let navigableList = flatList.map(function(item, index, arr){

// 		let indent = parseInt(item.indentLevel);
// 		let nextItem = arr[index + 1];
// 		if (!nextItem) return item;
// 		let nextIndent = parseInt(arr[index + 1].indentLevel);
// 		if (nextIndent > indent) return null;
// 		else return item;

// 	}).filter(function(item){
// 		return (item !== null);
// 	});

// 	let navIndex = navigableList.findIndex(function(item){
// 		return item._id === currentPageId;
// 	});

// 	return {
// 		next: navigableList[navIndex + 1],
// 		prev: navigableList[navIndex - 1]
// 	}

// }


