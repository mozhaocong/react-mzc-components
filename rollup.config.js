import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve' // 引入依赖包
import autoprefixer from 'autoprefixer'
import path from 'path'
// import dts from 'rollup-plugin-dts' // 生成组件库.d.ts文件，不过tsconfig配置 暂时用不到
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
const resolveFile = name => path.resolve(__dirname, name)
const extensions = ['.js', '.ts', '.tsx']

module.exports = [
	{
		input: 'components/index.ts',
		plugins: [
			json(),
			typescript({
				check: false,
				tsconfig: resolveFile('./rollupTsconfig.json'), // Local ts To configure
				extensions
			}),
			nodeResolve(),
			commonjs(),
			babel({
				babelHelpers: 'runtime',
				exclude: 'node_modules/**',
				plugins: ['@babel/plugin-transform-runtime']
			}),
			postcss({ plugins: [autoprefixer()] })
			// terser()
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
