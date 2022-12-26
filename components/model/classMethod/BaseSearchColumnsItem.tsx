import { DatePicker, Input, Tag } from 'antd'
import { arrayGetData, isArray, isNumber, isString, isTrue, objectRecursiveMerge } from 'html-mzc-tool'
import React from 'react'

import { formName } from '../Form/indexType'
import { getFormName, getFormValueFromName, setFormNameToValue } from '../Form/uitls/tool'
import { searchColumnsItem, slotListType } from '../SearchTable/indexType'
import { tagItemType } from '../SearchTable/model/CheckedTag'
import { BaseFormColumnsItem } from './BaseFormColumnsItem'

const { RangePicker } = DatePicker

type simpleSlotType = { slotList: slotListType; selectSlotOption?: ObjectMap; defaultSelect?: string; name?: string; placeholder?: string }

type baseSetCheckedType = {
	item: tagItemType
	labelKey?: formName
	textKey?: formName
	closeName: formName
	propsName?: Array<string | number> | string | number
	setOption?: (item: ObjectMap, nameData: any) => string | number | undefined | any[]
	setLabel?: (item: ObjectMap, nameData: any) => string | number | undefined
	multiple?: boolean // 是否多选
	option?: { value: string; label: string }[] // 多选的配置数组
}

type simpleInputSlotType = simpleSlotType & {
	component?: (item) => React.ReactElement
	setCheckedValue?: (nameValue: any, item: ObjectMap) => string | number | undefined | any[]
	setSearchData?: (item: ObjectMap, nameKey: string) => ObjectMap
}

export class BaseSearchColumnsItem extends BaseFormColumnsItem<searchColumnsItem> {
	simpleInputSlot(item: simpleInputSlotType): any {
		const { slotList, selectSlotOption = {}, defaultSelect, name, placeholder, component, setCheckedValue, setSearchData } = item
		if (!isTrue(slotList)) return
		const slotListFirst = slotList?.[0]?.key
		const slotListFirstKey = slotListFirst + 'Key'
		const selectSlotName = name ?? slotListFirstKey

		return {
			name: selectSlotName,
			selectSlot: {
				name: selectSlotName,
				...selectSlotOption,
				initialValue: {
					select: defaultSelect ?? slotListFirst
				},
				placeholder: placeholder,
				component: component
					? component
					: () => {
							return <Input />
					  },
				slotList: slotList
			},
			setChecked: (item: any) => {
				const data: ObjectMap = {}
				if (setCheckedValue) {
					data.setOption = () => {
						if (isTrue(item?.nameData?.option)) {
							return setCheckedValue(item?.nameData?.option, item)
						} else {
							return undefined
						}
					}
				}
				return this.simpleSlotInputChecked({
					item,
					...data
				})
			},
			setSearchData: (item: any) => {
				const { data, mapKey } = this.simpleInputSearchData({ item, name: selectSlotName })
				if (setSearchData) {
					return setSearchData(data, mapKey)
				}
				return data
			}
		}
	}

	simpleRangePickerSlot(item: simpleSlotType) {
		const { slotList, selectSlotOption = {}, defaultSelect, name, placeholder } = item
		if (!isTrue(slotList)) return
		const slotListFirst = slotList?.[0]?.key
		const slotListFirstKey = slotListFirst + 'Key'
		const selectSlotName = name ?? slotListFirstKey
		return {
			name: selectSlotName,
			selectSlot: {
				name: selectSlotName,
				...selectSlotOption,
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
				return this.simpleSlotRangePickerChecked({ item })
			},
			setSearchData: (item: any) => {
				return this.simpleRangePickerSearchData({ item, name: selectSlotName })
			}
		}
	}

	// 最基础的 设置Checked 的方法
	baseSetChecked(config: baseSetCheckedType): React.ReactElement {
		const { item, labelKey, textKey, closeName, propsName, setOption, setLabel, multiple = false, option: optionData } = config
		const { value, valueOtherData } = item
		const data = objectRecursiveMerge(value, valueOtherData?.value)

		let option: any
		let selectLabel
		let nameData = data
		if (isTrue(propsName)) {
			nameData = getFormValueFromName(data, propsName)
		}
		selectLabel = getFormValueFromName(nameData, labelKey)
		option = getFormValueFromName(nameData, textKey)
		if (setOption) {
			option = setOption(data, nameData)
		}
		if (setLabel) {
			selectLabel = setLabel(data, nameData)
		}

		function closeTag(e, item) {
			const { onClose } = item
			e.preventDefault()
			const data = setFormNameToValue(value, closeName, () => undefined)
			onClose(data)
		}

		function multipleCloseTag(e, item, res) {
			const { onClose } = item
			e.preventDefault()
			const data = setFormNameToValue(value, closeName, data => {
				data = data.filter(dataItem => {
					return dataItem !== res
				})
				return data
			})
			onClose(data)
		}

		if (multiple && !isArray(option)) {
			return <></>
		} else if (!multiple && !(isString(option) || isNumber(option))) return <></>
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
		return this.baseSetChecked({ labelKey: labelKey, item: item, textKey: textKey, closeName: textKey, multiple: true, setLabel, option })
	}

	getSlotLabelTextKey(item: any) {
		const {
			name,
			nameData,
			selectSlot: { slotList = [] }
		} = item
		const textKey = getFormName(name, 'option')
		const label = arrayGetData(slotList, { key: nameData.select })?.[0].label || ''
		return { textKey, label }
	}

	// slot 专用
	simpleSlotInputChecked(config: Omit<baseSetCheckedType, 'closeName' | 'labelKey' | 'textKey'>) {
		const { item, ...attrs } = config
		const { textKey, label } = this.getSlotLabelTextKey(item)
		return this.baseSetChecked({ setLabel: () => label, item: item, textKey, closeName: textKey, ...attrs })
	}

	// slot 专用
	simpleSlotRangePickerChecked(config: Omit<baseSetCheckedType, 'closeName' | 'labelKey' | 'textKey'>) {
		const { item, ...attrs } = config
		const { textKey, label } = this.getSlotLabelTextKey(item)
		return this.baseSetChecked({
			...attrs,
			item,
			setLabel: () => label,
			setOption: value => {
				const textData = getFormValueFromName(value, textKey)
				const data = this.momentToArray(textData)
				return data.join(',')
			},
			closeName: textKey
		})
	}

	// 获取 设置 slotComponent 的 相关参数
	getSlotComponentSearchDataKey(config: { item: tagItemType; name: formName }) {
		const { name } = config
		const { item } = config
		const nameKey = getFormName(name, 'option')
		const selectKey = getFormName(name, 'select')
		const mapKey = getFormValueFromName(item, selectKey)
		const textData = getFormValueFromName(item, nameKey)
		return { mapKey, textData, name }
	}

	// 设置 slotComponent 的 inout 的 搜索数据
	simpleInputSearchData(config: { item: tagItemType; name: formName }) {
		let { item } = config
		const { mapKey, textData, name } = this.getSlotComponentSearchDataKey(config)
		item = setFormNameToValue(item, name, () => {
			return undefined
		})
		if (isTrue(mapKey)) {
			item = setFormNameToValue(item, mapKey, () => {
				return textData
			})
		}
		return { data: item, mapKey }
	}

	// 设置 slotComponent 的 RangePicker 的 搜索数据
	simpleRangePickerSearchData(config: { item: tagItemType; name: formName }) {
		let { item } = config
		const { mapKey, textData, name } = this.getSlotComponentSearchDataKey(config)
		// const data = this.momentToArray(textData)
		const data = textData
		item = setFormNameToValue(item, name, () => {
			return undefined
		})
		if (isTrue(mapKey)) {
			item = setFormNameToValue(item, mapKey, () => {
				return data
			})
			item = this.setBaseRangePickerSearchParams({ item, nameKey: mapKey })
		}
		return item
	}

	// 基础 BaseRangePicker 使用
	setBaseRangePickerSearchParams(config: { item: any; nameKey: string }): any {
		try {
			const { item, nameKey } = config
			if (isTrue(item[nameKey]) && isArray(item[nameKey])) {
				item[`${nameKey}Start`] = this.dataMomentToTimeStartOf(item[nameKey][0])
				item[`${nameKey}End`] = this.dataMomentToTimeEndOf(item[nameKey][1])
				delete item[nameKey]
			}
			return item
		} catch (e) {
			const { item } = config
			return item
		}
	}

	// 普通 RangePicker  Checked 使用
	simpleRangePickerChecked(config: Omit<baseSetCheckedType, 'closeName'>) {
		const { item, textKey, ...attrs } = config
		return this.baseSetChecked({
			...attrs,
			item,
			setOption: value => {
				const textData = getFormValueFromName(value, textKey)
				const data = this.momentToArray(textData)
				return data.join(',')
			},
			closeName: textKey
		})
	}
}
