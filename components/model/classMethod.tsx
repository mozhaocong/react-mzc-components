import { Button, DatePicker, Input, Tag } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { arrayGetData, isArray, isString, isTrue, objectRecursiveMerge } from 'html-mzc-tool'
import moment from 'moment'
import React from 'react'

const { RangePicker } = DatePicker

function momentValueToString(value: any, format = 'YYYY-MM-DD') {
	return isTrue(value) ? moment(value).format(format) : ''
}

function serialNumber(item: { index: number; pageSize?: number; current?: number; [index: string]: any }): React.ReactElement {
	let { index, current, pageSize } = item
	index = index ? index * 1 : 0
	current = current ? current * 1 : 0
	pageSize = pageSize ? pageSize * 1 : 0
	let currentPageSize = 0
	if (current) {
		currentPageSize = (current - 1) * pageSize
	}

	const returnData = index + 1 + currentPageSize
	return <div>{returnData}</div>
}

import {
	columnsItem,
	ColumnTypeForm,
	formListPublicProps,
	formName,
	formPublicProps,
	formTablePublicProps,
	searchColumnsItem,
	slotListType
} from './Form/indexType'
import { getFormValueFromName, setFormNameToValue } from './Form/uitls/tool'
import { listSearchType, tagItemType } from './SearchTable/model/CheckedTag'

export class BaseFormColumnsItem<T = columnsItem<formPublicProps>> {
	data: Array<T>
	setColumns(item: Array<T>) {
		this.data = item
	}
	momentToArray(item: any[], format = 'YYYY-MM-DD') {
		return isTrue(item)
			? item.map(res => {
					return moment(res).format(format)
			  }) || []
			: []
	}
	momentValueToString = momentValueToString
}

type simpleSlotType = { slotList: slotListType; selectSlotOption?: ObjectMap; defaultSelect?: string; name?: string; placeholder?: string }

export class BaseSearchColumnsItem extends BaseFormColumnsItem<searchColumnsItem> {
	simpleInputSlot(item: simpleSlotType) {
		const { slotList, selectSlotOption = {}, defaultSelect, name, placeholder } = item
		if (!isTrue(slotList)) return
		const slotListFirst = slotList?.[0]?.key
		const slotListFirstKey = slotListFirst + 'Key'
		const slotListFirstValue = slotListFirst + 'Value'
		return {
			name: name ?? slotListFirstKey,
			selectSlot: {
				...selectSlotOption,
				selectNane: slotListFirstKey, // form表单的Name
				optionNane: slotListFirstValue,
				initialValue: {
					select: defaultSelect ?? slotListFirst
				},
				placeholder: placeholder,
				component: () => {
					return <Input />
				},
				slotList: slotList
			},
			setChecked: (item: any) => {
				return this.simpleInputChecked({
					item,
					labelKey: slotListFirstKey,
					textKey: slotListFirstValue
				})
			},
			setSearchData: (item: any) => {
				const key = item[slotListFirstKey]
				item[key] = item[slotListFirstValue]
				delete item[slotListFirstKey]
				delete item[slotListFirstValue]
				return item
			}
		}
	}

	simpleRangePickerSlot(item: simpleSlotType) {
		const { slotList, selectSlotOption = {}, defaultSelect, name, placeholder } = item
		if (!isTrue(slotList)) return
		const slotListFirst = slotList?.[0]?.key
		const slotListFirstKey = slotListFirst + 'Key'
		const slotListFirstValue = slotListFirst + 'Value'
		const slotListFirstMapKeys = slotListFirst + 'mapKeys'
		return {
			name: name ?? slotListFirstKey,
			selectSlot: {
				...selectSlotOption,
				selectNane: slotListFirstKey, // form表单的Name
				optionNane: slotListFirstValue,
				initialValue: {
					select: defaultSelect ?? slotListFirst
				},
				placeholder: placeholder,
				component: () => {
					return <RangePicker format='YYYY-MM-DD' />
				},
				slotList: slotList
			},
			setChecked: (item: any) => {
				return this.simpleRangePickerChecked({ item, labelKey: slotListFirstKey, textKey: slotListFirstValue })
			},
			setSearchData: (item: any) => {
				if (!isTrue(item[slotListFirstValue])) {
					delete item[slotListFirstKey]
					return item
				}
				const data = this.simpleRangePickerSearchData({ item, mapKeys: slotListFirstMapKeys, textKey: slotListFirstValue })
				const key = data[slotListFirstKey]
				data[`${key}Start`] = data[slotListFirstMapKeys][0]
				data[`${key}End`] = data[slotListFirstMapKeys][1]
				delete data[slotListFirstKey]
				delete data[slotListFirstMapKeys]
				delete data[slotListFirstValue]
				return data
			}
		}
	}

	baseSetChecked(config: {
		item: tagItemType
		label?: formName
		text?: formName
		closeName: formName
		propsName?: Array<string | number> | string | number
		setOption?: (item: ObjectMap, nameData: any) => string | number | undefined | any[]
		setLabel?: (item: ObjectMap, nameData: any) => string | number | undefined
		multiple?: boolean
		option?: { value: string; label: string }[]
	}): React.ReactElement {
		const { item, label, text, closeName, propsName, setOption, setLabel, multiple = false, option: optionData } = config
		const { value, valueOtherData } = item
		const data = objectRecursiveMerge(value, valueOtherData.value)

		let option: any
		let selectLabel
		let nameData = data
		if (isTrue(propsName)) {
			nameData = getFormValueFromName(data, propsName)
		}
		selectLabel = getFormValueFromName(nameData, label)
		option = getFormValueFromName(nameData, text)
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

		function multipleCloseTag(e, item, res) {
			const { onSearch } = item
			e.preventDefault()
			const data = setFormNameToValue(value, closeName, data => {
				data = data.filter(dataItem => {
					return dataItem !== res
				})
				return data
			})
			onSearch(data)
		}

		if (multiple && (!isArray(option) || !isTrue(optionData) || !isArray(optionData))) {
			return <></>
		} else if (!multiple && !isString(option)) return <></>
		if (isTrue(selectLabel) && isTrue(option)) {
			if (multiple) {
				return (
					<span className={'checked-span'}>
						<span> {selectLabel}: </span>
						{option.map((res, index) => {
							return (
								<Tag closable key={index} onClose={e => multipleCloseTag(e, item, res)}>
									{arrayGetData(optionData, { value: res })?.[0]?.label}
								</Tag>
							)
						})}
					</span>
				)
			} else {
				return (
					<span className={'checked-span'}>
						<span> {selectLabel}: </span>
						<Tag closable onClose={e => closeTag(e, item)}>
							{option}
						</Tag>
					</span>
				)
			}
		} else {
			return <></>
		}
	}

	simpleMultipleChecked(config: {
		option: { value: string; label: string }[]
		item: tagItemType
		labelKey?: formName
		labelText?: string
		textKey: formName
	}) {
		const { item, labelKey, textKey, labelText, option } = config
		let setLabel: any
		if (isTrue(labelText)) {
			setLabel = () => {
				return labelText
			}
		}
		return this.baseSetChecked({ label: labelKey, item: item, text: textKey, closeName: textKey, multiple: true, setLabel, option })
	}

	simpleInputChecked(config: { item: tagItemType; labelKey: formName; textKey: formName }) {
		const { item, labelKey, textKey } = config
		let label = labelKey
		if (isString(labelKey)) {
			label = label + 'Label'
		}
		return this.baseSetChecked({ label: label, item: item, text: textKey, closeName: textKey })
	}

	simpleRangePickerChecked(config: { item: tagItemType; labelKey: formName; textKey: formName }) {
		const { item, labelKey, textKey } = config
		let label = labelKey
		if (isString(labelKey)) {
			label = label + 'Label'
		}
		return this.baseSetChecked({
			item,
			label: label,
			setOption: item => {
				const textData = getFormValueFromName(item, textKey)
				const data = this.momentToArray(textData)
				return data.join(',')
			},
			closeName: textKey
		})
	}

	simpleRangePickerSearchData(config: { item: tagItemType; mapKeys: formName; textKey: formName }) {
		const { mapKeys, textKey } = config
		let { item } = config
		const textData = getFormValueFromName(item, textKey)
		const data = this.momentToArray(textData)
		item = setFormNameToValue(item, mapKeys, () => {
			return data
		})
		item = setFormNameToValue(item, textKey, () => {
			return undefined
		})
		return item
	}
}

export class BaseFormListColumnsItem extends BaseFormColumnsItem<columnsItem<formListPublicProps>> {}

export class BaseFormTableColumnsItem extends BaseFormColumnsItem<ColumnTypeForm<formTablePublicProps>> {
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
	serialNumber = serialNumber
}

export class BaseTableColumns {
	data: ColumnType<any>[]
	setColumns(item: Array<ColumnType<any>>) {
		this.data = item
	}
	momentValueToString = momentValueToString
	serialNumber = serialNumber
}

interface simpleCheckBoxSetCheckedType {
	label: string
	value: (string | number)[]
	options: { value: (string | number)[]; label: string }[]
	setValue: (item: any) => void
	setOptions: (item: any) => void
}

interface simpleCheckListSearchType extends simpleCheckBoxSetCheckedType {
	name: string
}

export class BaseSearchCheckedListSearch {
	data: listSearchType[]
	setColumns(item: listSearchType[]) {
		this.data = item
	}
	simpleCheckBoxSetChecked(item: simpleCheckBoxSetCheckedType) {
		const { label, setOptions, options, setValue, value } = item
		function closeTag(e: any, res: any) {
			e.preventDefault()
			const filterData = value.filter(item => item !== res.value)
			const filterOptions = options.filter(item => item.value !== res.value)
			setValue(filterData)
			setOptions(filterOptions)
		}
		return (
			<span className={'checked-span'}>
				<span>{label}: </span>
				{options.map((res, index) => {
					return (
						<Tag closable onClose={e => closeTag(e, res)} key={index}>
							{res.label}
						</Tag>
					)
				})}
			</span>
		)
	}
	simpleCheckListSearch(arrayItem: [simpleCheckListSearchType]) {
		const valueData = {}
		const columns = []
		arrayItem.forEach(item => {
			const { name, value, ...attrs } = item
			valueData[name] = value
			columns.push({
				name,
				setChecked: () => {
					return this.simpleCheckBoxSetChecked({ value, ...attrs })
				}
			})
		})
		return [{ columns, value: valueData }]
	}
}
