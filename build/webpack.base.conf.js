const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') //动态创建html 插件
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const chalk = require('chalk')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
module.exports = {
	cache: {
		// 开启持久化缓存
		type: 'filesystem'
		// buildDependencies: {
		//   config: [__filename]
		// }
	},
	mode: 'none',
	entry: {
		vendor: ['react', 'react-dom'],
		app: path.join(__dirname, '../src/index.tsx')
	},
	output: {
		clean: true,
		filename: '[name]-[hash].js',
		library: '[name]_library'
		// publicPath: publicPath
	},
	target: 'web',

	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: [
					{ loader: 'babel-loader' },
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [{ loader: 'babel-loader' }]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [require('autoprefixer')]
							}
						}
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader' // translates CSS into CommonJS
					},
					{
						loader: 'less-loader',
						options: {
							modules: true,
							lessOptions: {
								modifyVars: {
									'@ant-prefix': 'r'
								},
								javascriptEnabled: true
							}
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				include: /src/,
				type: 'asset/resource',
				generator: {
					filename: 'static/img/[name]-[hash:5][ext]'
				}
			}
		]
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		// new ESLintPlugin(),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, '../public/index.html'), // 添加模版文件
			filename: 'index.html'
		})
		// new ProgressBarPlugin({
		//   format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
		// }) // 进度条
		// new BundleAnalyzerPlugin() // 打包分析
	],
	resolve: {
		symlinks: false,
		alias: {
			'@': path.join(__dirname, '../src'),
			'@components': path.join(__dirname, '../components')
		},
		extensions: ['.tsx', '.ts', '.js', 'jsx'] //引入文件时无需加以上后缀
	}
}
