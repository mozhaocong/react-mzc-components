//4、webpack和commonjs的require.ensure (高阶组价)

import React, { Component } from 'react'

export default function (loading) {
	return class extends Component {
		constructor(props) {
			super(props)

			this.state = {
				Com: null
			}
		}

		componentWillMount() {
			new Promise((resolve, reject) => {
				// @ts-ignore
				require.ensure([], function (require) {
					//[]依赖项

					const c = loading().default

					console.log(c)

					resolve(c)
				})
			}).then(data => {
				this.setState({
					Com: data
				})
			})
		}

		render() {
			// @ts-ignore
			const Com = this.state.Com
			return Com ? <Com /> : null
		}
	}
}
