import { Tag } from '@components/antd'
import React from 'react'

export { BaseSearchColumnsItem } from '../classMethod/BaseSearchColumnsItem'
import { listSearchType } from '../SearchTable/model/CheckedTag'
export { BaseFormColumnsItem, BaseFormListColumnsItem, BaseFormTableColumnsItem, BaseTableColumns } from './BaseFormColumnsItem'

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

// checkBox 的 checkedTag 配置
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
	simpleCheckListSearch(arrayItem: [simpleCheckListSearchType]): any {
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
