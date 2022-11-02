const { merge } = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.conf')
const target = 'http://mall-dev.app.htwig.com/'
const options = merge(webpackConfigBase, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		compress: true,
		open: false,
		port: 3001,
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		historyApiFallback: {
			disableDotRule: true
		},
		proxy: {
			'/v3/': {
				target: target,
				changeOrigin: true
			}
		}
	}
})
module.exports = options
