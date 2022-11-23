import { Col, Form, Input, Row } from 'antd'
import { deepClone, isString } from 'html-mzc-tool'
import React, { cloneElement, useState } from 'react'

import { HtForm } from '@/components'
const { FormItem } = HtForm

const mapData = {
	componentsInput: <Input />
}

const data = [
	[
		'tes1',
		{
			props: { allowClear: true },
			component: 'componentsInput'
		}
	],
	[
		'tes2',
		{
			name: 'test2',
			props: {},
			component: () => {
				return <Input />
			}
		}
	],

	[
		{
			name: 'test3',
			component: 'componentsInput',
			col: { span: 6 },
			props: { allowClear: true }
		},
		{
			name: 'test4',
			component: () => {
				return <Input />
			}
		}
	]
]

export const setSlotComponents = item => {
	return (
		<Form.Item label={item?.label} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
			<Row>
				{item.map(item => {
					return <Col {...item.col}>{item.component()}</Col>
				})}
			</Row>
		</Form.Item>
	)
}

function multipleFormCloneElement(item) {
	if (item.component) {
		const data = item.component()
		item.component = () =>
			cloneElement(data, {
				...(item.props || {})
			})
	}
}

function setMultipleForm(item) {
	const mapData = item.map(res => {
		setComponents(res)
		multipleFormCloneElement(res)
		return {
			col: res.col || { span: 12 },
			component: () => <FormItem key={res.name} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} noStyle {...res} col={24} />
		}
	})
	return { customRender: () => setSlotComponents(mapData), labelCol: { span: 0 }, wrapperCol: { span: 24 } }
}

function setComponents(item: any) {
	if (isString(item.component)) {
		if (mapData[item.component]) {
			const data = mapData[item.component]
			item.component = () => data
		} else {
			item.component = undefined
		}
	}
}

function setData(data: any) {
	data = deepClone(data)
	const returnData = []
	data.forEach((item: any) => {
		if (item.length === 2) {
			if (isString(item[0])) {
				item[1].label = item[0]
				setComponents(item[1])
			} else {
				item[1] = setMultipleForm(item)
			}
			returnData.push(item[1])
		}
	})
	return returnData
}

const View = () => {
	const [value, setValue] = useState({})
	// console.log('setData', setData(data))
	return (
		<div>
			<HtForm value={value} onChange={setValue} columns={setData(data)} publicProps={{ allowClear: true }} />
			{JSON.stringify(value)}
		</div>
	)
}

export default React.memo(View)
