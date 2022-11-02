import { Button, Tag } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { isString, isTrue, objectRecursiveMerge } from 'html-mzc-tool'
import moment from 'moment'
import React from 'react'

import {
	columnsItem,
	ColumnTypeForm,
	formListPublicProps,
	formName,
	formPublicProps,
	formTablePublicProps,
	searchColumnsItem
} from '@/components/model/Form/indexType'

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
}

export class BaseSearchColumnsItem extends BaseFormColumnsItem<searchColumnsItem> {
	baseSetChecked(config: {
		item: tagItemType
		label?: formName
		text?: formName
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
		const { item, mapKeys, textKey } = config
		const textData = getFormValueFromName(item, textKey)
		const data = this.momentToArray(textData)
		setFormNameToValue(item, mapKeys, () => {
			return data.join(',')
		})
		setFormNameToValue(item, textKey, () => {
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
	serialNumber(item: { index: number; [index: string]: any }): React.ReactElement {
		return <div>{item.index + 1}</div>
	}
}

export class BaseTableColumns {
	data: ColumnType<any>[]
	setColumns(item: Array<ColumnType<any>>) {
		this.data = item
	}
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
			<span>
				<span>{label}</span>
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
