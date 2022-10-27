//引入一个包
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HTMLWebpackPlugin = require('html-webpack-plugin')

//webpack 中的所有配置都应该写在 module.exports 中
module.exports = {
	//指定入口文件
	entry: './src/index.ts',
	//指定打包文件所在目录
	output: {
		//指定打包文件的目录
		path: path.resolve(__dirname, 'dist'),
		//打包后文件的名字
		filename: 'bundle1.js'
		// publicPath: "/",
	},
	plugins: [
		// new HTMLWebpackPlugin(),
	],
	//指定webpack打包时使用的模块
	module: {
		//指定要加载的规则
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: 'ts-loader',
				exclude: ['/node_modules/']
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js', 'tsx', 'jsx']
	},
	externals: {
		ramda: 'ramda'
	}
}
