const dotenv = require('dotenv');
const nodeCache = require('node-cache');

dotenv.load();

module.exports = ArcClass => {
	return class ArcRender extends ArcClass {
		constructor() {
			super();
		}

		cacheInit(){
	
			if (!this.config.cache) return null;
			
			if (this.config.cache.redisPort) {
				this.cache = redis.createClient(this.config.cache.redisPort);
				this.cacheType = 'redis';
			} else {
				// if we're not using Redis, we'll fall back to simple memory caching
				this.cache = new NodeCache();
				this.cacheType = 'memory';
			}
			// this.cache = (this.config.cache.servers || process.env.MEMCACHIER_SERVERS) ? memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
			// 	failover: true,  // default: false
			// 	timeout: 1,      // default: 0.5 (seconds)
			// 	keepAlive: true  // default: false
			//   }) : memjs.Client.create();

		}

		async getCache(key, prefix){
			
			const fullKey = (prefix) ? prefix + key : this.config.cache.defaultPrefix + key;

			return new Promise(async (resolve, reject) => {
				this.cache.get(fullKey, function(err, value) {
					if (err) return reject(err);
					if (value !== null) return resolve(val);
					else resolve(null);
				});
			});
		}

		setCache(key, prefix, value){
			
			const fullKey = (prefix) ? prefix + key : this.config.cache.defaultPrefix + key;	
			
			this.cache.set(fullKey, value);
			
		}

		async cacheRoutesMiddleware(req, res, next){
			
			if (!this.config.cache) return next();

			if (this.config.cache.excludesRegex) {
				const pattern = new RegExp(this.config.cache.excludesRegex);
				if (pattern.test(req.originalUrl || req.ur)) return next();	
			}

			const cachedValue = await getCache(req.originalUrl || req.url);

			if (cachedValue) return res.send(cachedValue.toString('utf8'));
			else {
				// if the url is not cached, then hijack the send function to capture the value
				// Cache the rendered view for future requests
				res.sendRes = res.send
				res.send = async body => {
					const cacheSet = setCache(req.originalUrl || req.url, null, body);	
					return res.sendRes(body);
				}

				next();
			}
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
		
			// return new Promise(async (resolve, reject) => {

			// 	try {
			// 		this.cache.del(key, (err, count) => {
			// 			if (!err ){
			// 				this.log(`${key} cache key removed.`);
			// 				resolve();
			// 			}
			// 		});

			// 	} catch(err) {
			// 		this.log('error', err);
			// 		resolve();
			// 	}

			// });
		}

	};
};
