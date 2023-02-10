import { Col, Form, Row, Select } from '@components/antd'
import { isTrue } from 'html-mzc-tool'
import React, { useRef, useState } from 'react'

import { getFormValueFromName, setFormNameToValue } from './tool'

const { Option } = Select

function selectChange(value: string, item, stateDate) {
	const { valueData, setValue } = stateDate
	let slotName = ''
	item.slotList.forEach(res => {
		if (res.key === value) {
			slotName = res.name ?? item.optionNane
		}
	})
	if (isTrue(slotName)) {
		const returnData = setFormNameToValue(valueData.value, slotName, () => {
			return undefined
		})
		setValue(returnData)
	}
}

export const setSlotComponents = (item, stateData) => {
	const { col = { span: 6 }, labelCol = { span: 8 }, wrapperCol = { span: 12 } } = item
	const { value } = stateData
	return (
		<Col {...col}>
			<Form.Item label={item.label} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
				<Row>
					<Col {...labelCol}>
						<Form.Item
							initialValue={item.initialValue?.select}
							name={item.selectNane}
							noStyle
							rules={[{ required: true, message: 'Province is required' }]}>
							<Select
								placeholder={item.placeholder}
								onChange={e => {
									// 在setValueDebounce 中更新valueData的值
									// setSlotValueOther(item, stateData, res.children)
									selectChange(e, item, stateData)
								}}>
								{item.slotList.map(res => {
									return (
										<Option value={res.key} key={res.key}>
											{res.label}
										</Option>
									)
								})}
							</Select>
						</Form.Item>
					</Col>
					{isTrue(getFormValueFromName(value, item.selectNane) ?? item?.initialValue?.select) &&
						item.slotList
							.filter(res => {
								return res.key === (getFormValueFromName(value, item.selectNane) ?? item?.initialValue?.select)
							})
							.map(res => {
								return (
									<Col {...wrapperCol} key={res.key}>
										<Form.Item name={res.name ?? item.optionNane} initialValue={res.initialValue ?? item.initialValue?.option} noStyle>
											{res.component ? res.component(stateData) : item.component(stateData)}
										</Form.Item>
									</Col>
								)
							})}
				</Row>
			</Form.Item>
		</Col>
	)
}

type useFormDataConfig = {
	valueOtherData?: ObjectMap
}
export function useFormData(
	item = {},
	config: useFormDataConfig = {}
): {
	value: ObjectMap
	setValue: (item: any) => void
	valueData: { value: ObjectMap }
	valueOtherData: { value: ObjectMap }
} {
	const { valueOtherData: propsOtherData = {} } = config

	const valueData = useRef({ value: item })
	const valueOtherData = useRef({ value: propsOtherData })
	const [value, setValue] = useState(item)
	const handle = v => {
		if (!isTrue(v)) {
			valueOtherData.current.value = {}
		}
		valueData.current.value = v
		setValue(v)
	}

	return {
		value,
		setValue: handle,
		valueData: valueData.current,
		valueOtherData: valueOtherData.current
	}
}
