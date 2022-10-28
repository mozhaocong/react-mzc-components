import path from 'path'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve' // 引入依赖包
import json from '@rollup/plugin-json'
// import dts from 'rollup-plugin-dts' // 生成组件库.d.ts文件，不过tsconfig配置 暂时用不到
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import { terser } from 'rollup-plugin-terser'
const resolveFile = name => path.resolve(__dirname, name)
const extensions = ['.js', '.ts', '.tsx']

module.exports = [
	{
		input: 'src/components/index.ts',
		plugins: [
			json(),
			typescript({
				check: false,
				tsconfig: resolveFile('./tsconfig.json'), // Local ts To configure
				extensions
			}),
			nodeResolve(),
			commonjs(),
			babel({
				babelHelpers: 'runtime',
				exclude: 'node_modules/**',
				plugins: ['@babel/plugin-transform-runtime']
			}),
			postcss({ plugins: [autoprefixer()] }),
			terser()
		],
		output: [
			{
				file: 'lib/index.js', // 通用模块
				format: 'umd',
				name: 'htmlTool'
			},
			{
				file: 'es/index.js', // es6模块
				format: 'es'
			}
		],
		globals: {
			ramda: 'ramda',
			moment: 'moment',
			react: 'React',
			antd: 'antd',
			'html-mzc-tool': 'html-mzc-tool'
		},
		external: ['react', 'react-dom', 'classname', 'react-is', '**/node_modules/**', 'html-mzc-tool', 'React', 'react', 'antd']
	}
]
