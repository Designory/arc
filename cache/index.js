const dotenv = require('dotenv');
const nodeCache = require('node-cache');
const redis = require('redis');
const _ = require('lodash');

dotenv.load();

module.exports = ArcClass => {
	return class ArcRender extends ArcClass {
		constructor() {
			super();
		}

		cacheInit(){
	
			if (!this.config.cache) return null;
			
			if (this.config.cache.redisUrl) {
				this.cache = redis.createClient(this.config.cache.redisUrl);
				this.cacheType = 'redis';
			} else {
				// if we're not using Redis, we'll fall back to simple memory caching
				this.cache = new nodeCache();
				this.cacheType = 'memory';
			}

			// node-cache uses event handlers, 
			// so we account for flush success here
			if (this.cacheType === 'memory') {
				this.cache.on( 'flush', function(){
					console.log('Cache flushed');
				});
			}

		}

		async getCache(key, prefix){

			const fullKey = (prefix) ? prefix + key : this.config.cache.defaultPrefix + key;

			return new Promise(async (resolve, reject) => {
				this.cache.get(fullKey, function(err, value) {
					if (err) return reject(err);
					if (value !== null) {
						return resolve(value);
					}
					else resolve(null);
				});
			});
		}

		setCache(key, prefix, value, expires){
			
			const fullKey = (prefix) ? prefix + key : this.config.cache.defaultPrefix + key;

			if (this.cacheType === 'redis') {
				if (expires || this.config.cache.expires) this.cache.set(fullKey, value, 'EX', expires || this.config.cache.expires);	
				else this.cache.set(fullKey, value);
			} else if (this.cacheType === 'memory') {
				if (expires || this.config.cache.expires) this.cache.set(fullKey, value, expires || this.config.cache.expires);
				else this.cache.set(fullKey, value);
			}
			
		}

		async cacheRoutesMiddleware(req, res, next){

			if (!this.config.cache) return next();

			if (this.config.cache.excludesRegex) {
				const pattern = new RegExp(this.config.cache.excludesRegex);
				if (pattern.test(req.originalUrl || req.ur)) return next();	
			}	

			// we don't want to cache any POST requests
			// noting like all form posts coming in the same :)
			if (!this.config.cache.enableCacheOnPost) {
				if (req.method == "POST") return next();
			}

			const cachedValue = await this.getCache(req.originalUrl || req.url);

			if (cachedValue) {
			console.log('found key! yay!')
				return res.send(cachedValue);

			} else {
				// if the url is not cached, then hijack the send function to capture the value
				// Cache the rendered view for future requests
				res.sendRes = res.send
				res.send = async body => {
					this.setCache(req.originalUrl || req.url, null, body);	
					return res.sendRes(body);
				}

				next();
			}
		}
		// fluhes the full cache unless
		// key provided (when functionality built)
		// TODO: add key recognition
		cacheFlush(key) {
			
			if (this.cacheType === 'redis') {
				this.cache.flushdb((err, succeeded) => {
					if (succeeded) console.log('Cache flushed'); // will be true if successfull
				});
			} else if (this.cacheType === 'memory') {
				this.cache.flushAll();
			}
		}

		cacheClearSaveHook(listConfig, stgList, prodList){

			const self = this;

			if (listConfig.listName === this.config['treeModel'] || listConfig.flushCache){				
				stgList.schema.post('save', async function(next) {
					_.debounce(self.cacheFlush, self.config.cache.debounceWait * 1000 || 10 * 1000);
				});
				prodList.schema.post('save', async function(next) {
					_.debounce(self.cacheFlush, self.config.cache.debounceWait * 1000 || 10 * 1000);
				});
			}
			
		}

	};
};
