import { debounce, deepClone, isTrue } from 'html-mzc-tool'
import { Button, Col, Form, Row, Select } from 'antd'
import React, { useRef, useState } from 'react'
import { getFormValueFromName, setFormNameToValue, setSlotValueOther } from './tool'
import { ColumnType } from 'antd/lib/table/interface'
import { columnsItem, ColumnTypeForm, formListPublicProps, formName, formPublicProps, formTablePublicProps } from '../indexType'

const { Option } = Select

// 防抖 避免多少触发更新
const setValueDebounce = debounce(setValueMethod, 10)

function setDefaultSlotNameValueOtherData(item, initialValue, stateDate) {
	const { slotList = [] } = item
	let option = undefined
	slotList.forEach(res => {
		if (res.key === initialValue) {
			option = { key: initialValue, value: initialValue, children: res.label }
		}
	})
	selectChange(initialValue, option, item, stateDate)
}

function setValueMethod(item, stateData, pageSate, slotName) {
	const { setValue } = stateData
	let value = deepClone(stateData.value)
	let isInit = false
	if (!isTrue(slotName)) return
	slotName.forEach(res => {
		const slotNameData = pageSate[res]
		const { selectNane, initialValue } = slotNameData
		if (!isTrue(getFormValueFromName(value, selectNane))) {
			value = setFormNameToValue(value, selectNane, res => {
				if (!isTrue(res)) {
					isInit = true
					return initialValue.select
				}
				return res
			})
			setDefaultSlotNameValueOtherData(pageSate[res], initialValue.select, stateData)
		}
	})

	if (isInit) {
		setValue(value)
	}
}

function selectChange(e, option, item, stateDate) {
	const { valueData, setValue, valueOtherData } = stateDate
	let slotName = ''
	item.slotList.forEach(res => {
		if (res.key === e) {
			slotName = res.name ?? item.optionNane
		}
	})

	setSlotValueOther(item, valueOtherData, option.children)

	const returnData = setFormNameToValue(valueData.value, slotName, () => {
		return undefined
	})
	setValue(returnData)
}

export function setSlotComponents(item, stateData, pageSate, slotName) {
	const { value } = stateData
	setValueDebounce(item, stateData, pageSate, slotName)
	return (
		<Col span={8}>
			<Form.Item label={item.label} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
				<Row>
					<Col span={12}>
						<Form.Item
							initialValue={item.initialValue?.select}
							name={item.selectNane}
							noStyle
							rules={[{ required: true, message: 'Province is required' }]}>
							<Select placeholder={item.placeholder} onChange={(e, res) => selectChange(e, res, item, stateData)}>
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
									<Col span={12} key={res.key}>
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

export function setFormColumnsSlotName(item, pageSate) {
	const slotName = []
	return item.map(res => {
		if (res.slotName && pageSate[res.slotName]) {
			slotName.push(res.slotName)
			res.render = renderItem => {
				return setSlotComponents(pageSate[res.slotName], renderItem, pageSate, slotName)
			}
		}
		return res
	})
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

export class baseFormColumnsItem<T = columnsItem<formPublicProps>> {
	data: Array<T>
	setColumns(item: Array<T>) {
		this.data = item
	}
	serialNumber(item: { index: number; [index: string]: any }): React.ReactElement {
		return <div>{item.index + 1}</div>
	}
}

export class baseFormListColumnsItem extends baseFormColumnsItem<columnsItem<formListPublicProps>> {}

export class baseFormTableColumnsItem extends baseFormColumnsItem<ColumnTypeForm<formTablePublicProps>> {
	actionButton(item: formTablePublicProps, name: formName): React.ReactElement {
		const { value, index, setValue } = item
		const data = getFormValueFromName(value, name)
		return (
			<>
				{data.length !== 1 && (
					<Button
						type={'link'}
						onClick={() => {
							data.splice(index, 1)
							setValue(
								setFormNameToValue(value, name, () => {
									return data
								})
							)
						}}>
						删除
					</Button>
				)}
				{data.length === index + 1 && (
					<Button
						type={'link'}
						onClick={() => {
							data.push({})
							setValue(
								setFormNameToValue(value, name, () => {
									return data
								})
							)
						}}>
						添加行
					</Button>
				)}
			</>
		)
	}
}

export class baseTableColumns {
	data: ColumnType<any>[]
	setColumns(item: Array<ColumnType<any>>) {
		this.data = item
	}
}
