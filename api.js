const dotenv = require('dotenv');
const _ = require('lodash');

dotenv.load();

module.exports = ArcClass => class ArcModel extends ArcClass {
	getList(module, callback) {
		const stagingPrefix = this.get('stgPrefix') ? this.get('stgPrefix') : 'Stg';

		try {
			const unprefixedList = this.utils.unprefix(module, stagingPrefix);
			const prefixedList = (stagingPrefix + "-" + unprefixedList).toLowerCase();

			const List = this.list(prefixedList);

			return List.model.find().exec((err, data) => {
				if (err) return callback(err, null);
				return callback(null, data);
			});
		} catch (err) {
			return callback(err, null);
		}
	}

	getModule(module, id, callback) {
		const stagingPrefix = this.get('stgPrefix') ? this.get('stgPrefix') : 'Stg';

		try {
			const unprefixedList = this.utils.unprefix(module, stagingPrefix);
			const prefixedList = (stagingPrefix + "-" + unprefixedList).toLowerCase();

			const List = this.list(prefixedList);

			return List.model.findOne().where('_id', id).exec((err, data) => {
				if (err) return callback(err, null);
				return callback(null, data);
			});
		} catch (err) {
			return callback(err, null);
		}
	}

	getMultiModule(module, ids, callback) {
		const stagingPrefix = this.get('stgPrefix') ? this.get('stgPrefix') : 'Stg';

		const idsArray = ids.split(',');

		try {
			const unprefixedList = this.utils.unprefix(module, stagingPrefix);
			const prefixedList = (stagingPrefix + "-" + unprefixedList).toLowerCase();

			const List = this.list(prefixedList);

			return List.model.aggregate([
				{ $match: { _id: { $in: idsArray } } },
				{ $project: {
					weight: {
						$cond: [
							{ $eq: ['$_id', 4] },
							1,
							{
								$cond: [
									{ $eq: ['$_id', 2] },
									2,
									3
								]
							}
						]
					}
				} },
				{ $sort: { weight: 1 } }
			]).exec((err, data) => {
				if (err) return callback(err, null);

				return callback(null, data);
			});

			// return List.model
			// 	.find({ _id: { $in: idsArray } })
			// 	.exec((err, data) => {
			// 		if (err) return callback(err, null);
			// 		return callback(null, data);
			// 	});
		} catch (err) {
			return callback(err, null);
		}
	}

	/**
	 *
	 * @param {string} module - module type to create
	 * @param {object} data - object of properties to create module with
	 * @param {*} req - express request object
	 * @param {*} callback - callback passed either err or data of created item
	 */
	createModule(module, data, req, callback) {
		const stagingPrefix = this.get('stgPrefix') ? this.get('stgPrefix') : 'Stg';

		try {
			const unprefixedList = this.utils.unprefix(module, stagingPrefix);
			const prefixedList = (stagingPrefix + "-" + unprefixedList).toLowerCase();

			const List = this.list(prefixedList);
			const Item = new List.model();

			data = req.body;

			return Item.getUpdateHandler(req).process(data, err => {
				if (err) return callback({ message: 'Error creating module' }, null);

				const createdItem = _.extend({}, Item, data); // faux item based on query data

				return callback(null, createdItem); // return the faux item
			});
		} catch (err) {
			return callback(err, null);
		}
	}

	removeModule(module, id, callback) {
		const stagingPrefix = this.get('stgPrefix') ? this.get('stgPrefix') : 'Stg';

		try {
			const unprefixedList = this.utils.unprefix(module, stagingPrefix);
			const prefixedList = (stagingPrefix + "-" + unprefixedList).toLowerCase();

			const List = this.list(prefixedList);

			return List.model
				.findOne()
				.where('_id', id)
				.exec((err, data) => {
					if (err) return callback(err, null);
					if (!data) return callback('Item already deleted or does not exist.', null);

					return data.remove(rmErr => {
						if (rmErr) return callback(rmErr, null);
						return callback(null, { removed: data });
					});
				});
		} catch (err) {
			return callback(err, null);
		}
	}

	updateModule(module, id, data, req, callback) {
		const stagingPrefix = this.get('stgPrefix') ? this.get('stgPrefix') : 'Stg';

		try {
			const unprefixedList = this.utils.unprefix(module, stagingPrefix);
			const prefixedList = (stagingPrefix + "-" + unprefixedList).toLowerCase();

			const List = this.list(prefixedList);

			// console.log('ID', id)
			console.log('Data', data);
			// console.log('Req', req.body);

			return List.model.findOne().where('_id', id)
				.exec((err, item) => {
					if (err) return callback(err, null);

					return item.getUpdateHandler(req).process(data, updateErr => {
						if (updateErr) return callback(updateErr, null);
						return callback(null, data);
					});
				});
		} catch (err) {
			return callback(err, null);
		}
	}
};
