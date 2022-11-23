import { Col, Form } from 'antd'
import { isFunctionOfOther, isObject, isString, isTrue } from 'html-mzc-tool'
import React, { cloneElement } from 'react'

import { columnsItem } from '../indexType'

const View = (props: columnsItem): React.ReactElement => {
	const { extra, style, name, labelAlign, label, publicProps = {}, display, render, component, col = { span: 8 }, customRender, ...attrs } = props

	if (display) {
		if (display(publicProps) === false) {
			return <></>
		}
	}
	if (render) {
		return render(publicProps)
	}
	if (!component) {
		return <></>
	}

	let componentPublicProps = {}
	if (isObject(publicProps?.publicProps)) {
		componentPublicProps = publicProps?.publicProps
	}

	function setElement() {
		const data = component(publicProps)
		if (isString(data)) {
			return data
		} else {
			return cloneElement(data, {
				...componentPublicProps
			})
		}
	}

	return (
		<Col {...col} key={JSON.stringify(name)}>
			{isTrue(customRender) ? (
				customRender(publicProps)
			) : (
				<Form.Item
					style={style}
					extra={isFunctionOfOther(extra)}
					labelAlign={labelAlign}
					className='htFromItem'
					name={name}
					label={isFunctionOfOther(label)}
					{...attrs}>
					{setElement()}
				</Form.Item>
			)}
		</Col>
	)
}

export default View
