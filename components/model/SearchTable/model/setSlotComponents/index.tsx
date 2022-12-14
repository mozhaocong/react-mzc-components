import { Col, Form, Row, Select } from 'antd'
import { arrayGetData, deepClone, isArray, isTrue } from 'html-mzc-tool'
import React from 'react'

import { getFormName, getFormValueFromName, setFormNameToValue } from '../../../Form/uitls/tool'

const { Option } = Select

export function setSlotValueMethod(item, stateData) {
	const { setValue, value } = stateData
	let isInit = false
	const { selectNane, initialValue } = item
	if (!isTrue(getFormValueFromName(value, selectNane))) {
		const setData = setFormNameToValue(value, selectNane, res => {
			if (!isTrue(res)) {
				isInit = true
				return initialValue.select
			}
			return res
		})
		if (isInit) {
			setValue(setData)
		}
	}
}

// 设置 form slot valueOther的值
export function setSlotValueOther(item, stateDate) {
	const { valueOtherData, value } = stateDate
	const slotListData = arrayGetData(item.slotList, { key: getFormValueFromName(value, item.selectNane) })
	if (!isTrue(slotListData)) return
	let selectNameLabel: any
	if (isArray(item.selectNane)) {
		selectNameLabel = deepClone(item.selectNane)
		selectNameLabel[selectNameLabel.length - 1] = selectNameLabel[selectNameLabel.length - 1] + 'Label'
	} else {
		selectNameLabel = item.selectNane + 'Label'
	}
	valueOtherData.value = setFormNameToValue(valueOtherData.value, selectNameLabel, () => {
		return slotListData[0].label
	})
}

function selectChange(item, stateDate) {
	const { valueData, setValue } = stateDate
	const { name } = item
	const setName = getFormName(name, 'option')
	const returnData = setFormNameToValue(valueData.value, setName, () => {
		return undefined
	})
	setValue(returnData)
}

export const setSlotComponents = (item, stateData) => {
	const { selectSlot } = item
	const { col = { span: 6 } } = selectSlot
	return (
		<Col {...col}>
			<Form.Item label={item.label} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
				{SlotObject(item, stateData)}
			</Form.Item>
		</Col>
	)
}

const SlotObject = (item, stateData) => {
	const { selectSlot } = item
	const { col = { span: 6 }, labelCol = { span: 8 }, wrapperCol = { span: 12 }, ...config } = selectSlot
	const { slotList = [], initialValue, component, name } = config
	const { select } = initialValue
	const selectName = [name, 'select']
	const optionName = [name, 'option']
	const { value } = stateData
	const selectNaneValue = getFormValueFromName(value, 'selectNane')
	return (
		<Row>
			<Col style={{ overflow: 'hidden' }} {...labelCol}>
				<Form.Item initialValue={select} name={selectName} noStyle rules={[{ required: true, message: 'Province is required' }]}>
					<Select
						onChange={() => {
							selectChange(item, stateData)
						}}>
						{slotList.map(res => {
							return (
								<Option value={res.key} key={res.key}>
									{res.label}
								</Option>
							)
						})}
					</Select>
				</Form.Item>
			</Col>
			{isTrue(selectNaneValue ?? select) &&
				slotList
					.filter(res => {
						return res.key === (selectNaneValue ?? select)
					})
					.map(res => {
						return (
							<Col {...wrapperCol} key={res.key}>
								<Form.Item name={optionName} noStyle>
									{res.component ? res.component(stateData) : component(stateData)}
								</Form.Item>
							</Col>
						)
					})}
		</Row>
	)
}
