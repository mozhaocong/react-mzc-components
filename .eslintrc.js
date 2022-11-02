module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:react-hooks/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020
	},
	globals: {
		__webpack_public_path__: true
	},
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'simple-import-sort', 'prettier'],
	rules: {
		'react-hooks/exhaustive-deps': 0,
		'prettier/prettier': 'error',
		camelcase: 'off',
		'react/prop-types': 0,
		'react/jsx-uses-react': 2,
		'react/react-in-jsx-scope': 0,
		'@typescript-eslint/camelcase': ['off', { properties: 'always' }],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error'
	}
}
