const webpack = require('webpack');
const CONFIG = require('./jfrog-native-ui.config');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {

	context: __dirname + '/src',
	entry: {
		'jfrog-native-ui': ['./main.js',
		              './directives/directives.module.js',
		              './services/services.module.js',
		              './ui_components/ui_components.module.js']
	},
	output: {
		path: CONFIG.DESTINATIONS.TARGET,
		filename: '[name].js'
	},
	plugins: [
		new ngAnnotatePlugin({
			remove: true,
			add: true
		})
	],
	module: {
		loaders: [
			{test: /\.js$/, loader: 'babel'},
			{test: /\.json$/, loader: 'json'},
			{test: /\.html/, loader: 'html'},
		]
	}
};