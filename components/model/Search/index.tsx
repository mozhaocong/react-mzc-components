import { Col, Form, Input, Row } from '@components/antd'
import { deepClone, isString } from 'html-mzc-tool'
import React, { cloneElement, useMemo } from 'react'

import HtForm from '../Form'
import { _FormType } from '../Form/indexType'
const { FormItem } = HtForm

let mapData = {
	input: <Input />
}
function setComponentMapData(item) {
	mapData = { ...mapData, ...item }
}

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

type propsType = Omit<_FormType, 'columns'> & {
	columns: any[]
}

let _Search: React.FC<propsType> = props => {
	const { columns = [], ...attrs } = props

	const columnsData = useMemo(() => {
		return setData(columns)
	}, [columns])
	return <HtForm {...attrs} columns={columnsData} />
}

_Search = React.memo(_Search)
export default _Search as typeof _Search & {
	setComponentMapData: typeof setComponentMapData
}

// @ts-ignore
_Search.setComponentMapData = setComponentMapData
