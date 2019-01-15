const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const path = require('path');
const webpackDevConfig = require('../../../admin/webpack.dev');
const webpackProdConfig = require('../../../admin/webpack.prod');

let webpackRan = false;

module.exports = (req, res, next) => {
	// ignore if webpack was already ran. TODO: build in config for watching
	if (webpackRan) return next();

	const buildMode = process.env.ARC_ENV || 'production';

	const webpackConfig = () => {
		if (buildMode === 'production') {
			console.log('production');
			return webpackProdConfig;
		}

		if (buildMode === 'development') {
			console.log('development');
			return webpackDevConfig;
		}

		// super default config
		return {
			entry: path.resolve(__dirname, '../admin/app.js'), // TODO: this may need to change based on node_modules dir
			mode: buildMode,
			resolve: {
				alias: {
					vue$: 'vue/dist/vue.esm.js'
				}
			},
			output: {
				filename: 'bundle.js',
				path: path.resolve(__dirname, '../admin/public/js') // TODO: this may need to change based on node_modules dir
			}
		};
	};

	return webpack(webpackConfig()).run((err, stats) => {
		if (err) {
			console.error(err.stack || err);
			if (err.details) {
				console.error(err.details);
			}
			return next();
		}

		const info = stats.toJson();

		if (stats.hasErrors()) {
			console.error(info.errors);
			return next();
		}

		if (stats.hasWarnings()) {
			console.warn(info.warnings);
			return next();
		}

		console.log('webpack bundle complete');

		webpackRan = true;
		return next();
	});
};
