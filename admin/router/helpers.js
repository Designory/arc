export default {
	getRoutes(dirsNum, getArray) {

		let pathArr = ['panel', 'page', 'module'];

		if (getArray) return pathArr;

		let dirLength = dirsNum || pathArr.length;
		let pathStr = '';

		for (let i = 0; i < dirLength; i++) {
			pathStr += '/:' + pathArr[i];
		}

		return pathStr;

	},
	setPath(name, value, route) {
		let routesOrderArr = this.getRoutes(null, true);
		let currentPathArr = route.fullPath.split('/');

		currentPathArr.shift();

		let newPathArr = [];

		for (let i = 0, len = currentPathArr.length; i < len; i++) {
			if (name == routesOrderArr[i]) newPathArr.push(value);
			else newPathArr.push(currentPathArr[i]);
		}

		return '/' + newPathArr.join('/');
	}
}