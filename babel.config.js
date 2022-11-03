module.exports = {
	presets: [
		'@babel/preset-react',
		[
			'@babel/preset-typescript',
			{
				isTSX: true, //关键配置
				allExtensions: true //关键配置
			}
		],
		[
			'@babel/env',
			{
				modules: false,
				useBuiltIns: 'usage', //这里使用babel的自动生成polyfill依赖的功能
				corejs: {
					version: 3, // 使用core-js@3
					proposals: true
				},
				loose: true
			}
		]
	],
	plugins: [
		['import', { libraryName: 'antd', style: 'css' }, 'ant'],
		[
			'import',
			{
				libraryName: '@ant-design/icons',
				libraryDirectory: 'es/icons',
				camel2DashComponentName: false
			},
			'ant-design-icons'
		]
	]
}
