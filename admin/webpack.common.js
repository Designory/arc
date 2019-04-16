const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
	entry: {
		app: path.resolve(__dirname, './app.js')
	},
	resolve: {
		extensions: ['.js', '.vue', '.css', '.json'],
		alias: {
			vue$: 'vue/dist/vue.esm.js',
			root: path.join(__dirname, '../'),
			components: path.join(__dirname, '../components')
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bowercomponents)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader']
			},
			{
				test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
				loader: 'file-loader',
				query: {
					name: 'static/media/[name].[hash:8].[ext]'
				}
			},
			{
				test: /\.svg$/,
				loader: 'raw-loader'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['public']),
		new HtmlWebpackPlugin({
			title: 'ARC',
			template: path.resolve(__dirname, 'index.html'),
			filename: 'index.html'
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
		})
	],
	output: {
		filename: devMode ? '[name].bundle.js' : '[name].[hash].bundle.js',
		path: path.resolve(__dirname, './public'),
		publicPath: '/arc/static'
	}
};
