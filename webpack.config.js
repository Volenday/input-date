const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
	mode: 'production',
	context: __dirname,
	devtool: false,
	entry: {
		index: ['@babel/polyfill/noConflict', './index.js']
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['@babel/react', '@babel/env'],
					plugins: [
						'react-html-attrs',
						['@babel/proposal-decorators', { legacy: true }],
						'@babel/proposal-class-properties',
						'@babel/plugin-proposal-export-default-from',
						'@babel/plugin-syntax-dynamic-import'
					]
				}
			},
			{
				test: /\.(css|scss)$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				}
			},
			{
				test: /\.(jpg|png|svg|gif)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'images/[name].[hash].[ext]'
					}
				}
			}
		]
	},
	output: {
		path: `${__dirname}/dist/`,
		filename: '[name].min.js',
		chunkFilename: '[name].[chunkhash].chunk.min.js',
		libraryTarget: 'commonjs2'
	},
	plugins: [
		new BundleAnalyzerPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		})
	],
	externals: {
		lodash: 'commonjs2 lodash',
		moment: 'commonjs2 moment',
		react: 'commonjs2 react',
		'evergreen-ui': 'commonjs2 evergreen-ui',
		'rc-calendar': 'commonjs2 rc-calendar',
		'rc-time-picker': 'commonjs2 rc-time-picker',
		'react-dom': 'commonjs react-dom'
	}
};
