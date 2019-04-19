const dotenv = require('dotenv');
const nodeCache = require('node-cache');
dotenv.load();

module.exports = ArcClass => {
	return class ArcRender extends ArcClass {
		constructor() {
			super();
		}

		cacheInit(){

			this.cacheSettings = this.config.cacheSettings || { stdTTL: 100, checkperiod: 120 };
			this.cache = new nodeCache(this.cacheSettings);

		}

		cacheClearSaveHook(listConfig, stgList, prodList){
			
			const self = this;

			if (listConfig.listName === this.config['treeModel']){
				// stgList.schema.pre('save', async function(next) {

				// 	if (this.isModified('pageDataCode')) {
  				// 		await self.clearCacheByPrefix(`api__modules__${this._id}`);
  				// 		next();
				// 	} else {
				// 		next();
				// 	}	

				// });
			}
		}

		clearCacheByPrefix(key){
		
			return new Promise(async (resolve, reject) => {

				try {
					this.cache.del(key, (err, count) => {
						if (!err ){
							this.log(`${key} cache key removed.`);
							resolve();
						}
					});

				} catch(err) {
					this.log('error', err);
					resolve();
				}

			});
		}

	};
};
