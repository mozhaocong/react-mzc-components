import React, { Component } from 'react'
import { InputNumber } from 'antd'
import { isEmpty, isNil } from 'ramda'

type props = {
	onChange?: (item: any) => void
	value?: ObjectMap
	minProp?: ObjectMap
	maxProp?: ObjectMap
	disabled?: boolean
	style?: ObjectMap
	width?: string
}

export default class minMaxInput extends Component<props> {
	constructor(props: props) {
		super(props)
	}

	mixChange = e => {
		const { onChange, value } = this.props
		if (onChange) {
			onChange({
				...value,
				minValue: e
			})
		}
	}
	maxChange = e => {
		const { onChange, value } = this.props
		if (onChange) {
			onChange({
				...value,
				maxValue: e
			})
		}
	}

	minMaxBlur = () => {
		setTimeout(() => {
			const { value, onChange } = this.props
			if (!value) {
				return
			}
			let { minValue, maxValue } = value
			if (isNil(minValue) || isNil(maxValue) || isEmpty(maxValue) || isEmpty(minValue)) {
				return
			}
			let data = ''
			if (minValue > maxValue) {
				data = minValue
				minValue = maxValue
				maxValue = data
			}
			onChange({
				minValue,
				maxValue
			})
		}, 0)
	}

	render() {
		let { value } = this.props
		const { minProp, maxProp, disabled, style, width } = this.props
		if (!value) {
			value = {}
		}
		const { minValue, maxValue } = value
		return (
			<div style={style}>
				<InputNumber
					disabled={disabled}
					value={minValue}
					style={{ width: width ?? '140px' }}
					onBlur={this.minMaxBlur}
					onChange={this.mixChange}
					{...{ min: 0, ...minProp }}
				/>
				<span style={{ margin: '0 10px' }}>至</span>
				<InputNumber
					value={maxValue}
					disabled={disabled}
					style={{ width: width ?? '140px' }}
					onBlur={this.minMaxBlur}
					onChange={this.maxChange}
					{...{ min: 1, ...maxProp }}
				/>
			</div>
		)
	}
}
