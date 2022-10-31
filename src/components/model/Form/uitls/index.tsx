import { arrayGetData, deepClone, isArray, isTrue, objectRecursiveMerge } from 'html-mzc-tool'
import { Button, Col, Form, Row, Select, Tag } from 'antd'
import React, { useRef, useState } from 'react'
import { getFormValueFromName, setFormNameToValue } from './tool'
import { ColumnType } from 'antd/lib/table/interface'
import { columnsItem, ColumnTypeForm, formListPublicProps, formName, formPublicProps, formTablePublicProps, searchColumnsItem } from '../indexType'
import { tagItemType } from '../../SearchTable/model/CheckedTag'

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
	const { value } = stateData
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
}

export class baseSearchColumnsItem<T = searchColumnsItem> {
	data: Array<T>
	setColumns(item: Array<T>) {
		this.data = item
	}
	baseSetChecked(config: {
		item: tagItemType
		label?: string
		text?: string
		closeName: formName
		propsName?: Array<string | number> | string | number
		setOption?: (item: ObjectMap, nameData: any) => string | number | undefined
		setLabel?: (item: ObjectMap, nameData: any) => string | number | undefined
	}): React.ReactElement {
		const { item, label = 'selectLabel', text = 'option', closeName = ['spPlatform', 'option'], propsName, setOption, setLabel } = config
		const { value, valueOtherData } = item
		const data = objectRecursiveMerge(value, valueOtherData.value)

		let option
		let selectLabel
		let nameData = data
		if (isTrue(propsName)) {
			nameData = getFormValueFromName(data, propsName)
		}
		selectLabel = nameData[label]
		option = nameData[text]
		if (setOption) {
			option = setOption(data, nameData)
		}
		if (setLabel) {
			selectLabel = setLabel(data, nameData)
		}

		function closeTag(e, item) {
			const { onSearch } = item
			e.preventDefault()
			const data = setFormNameToValue(value, closeName, () => undefined)
			onSearch(data)
		}
		if (isTrue(selectLabel) && isTrue(option)) {
			return (
				<Tag closable onClose={e => closeTag(e, item)}>
					{selectLabel}: {option}
				</Tag>
			)
		} else {
			return <></>
		}
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
	serialNumber(item: { index: number; [index: string]: any }): React.ReactElement {
		return <div>{item.index + 1}</div>
	}
}

export class baseTableColumns {
	data: ColumnType<any>[]
	setColumns(item: Array<ColumnType<any>>) {
		this.data = item
	}
}
