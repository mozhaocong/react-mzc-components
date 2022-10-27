import React from 'react'
import { isFunctionOfOther, isTrue } from 'html-mzc-tool'
import { Col, Form } from 'antd'
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
					{component(publicProps)}
				</Form.Item>
			)}
		</Col>
	)
}

export default View
