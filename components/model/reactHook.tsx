import { Spin } from 'antd'
import { isTrue } from 'html-mzc-tool'
import React, { useEffect, useMemo, useState } from 'react'

import CheckBox from './CheckBox'
import { BaseSearchCheckedListSearch } from './classMethod'

interface setCheckDomType {
	name: string
	options: Array<{ label: string; value: any }>
	label: string
	onChange?: (item: ObjectMap) => void
	loading?: boolean
}

export function useSimpleCheckDom(item: setCheckDomType): {
	checkedListSearch: any
	CheckDom: React.ReactElement
	setSearchData: (item) => ObjectMap
} {
	const { name, options: itemOptions, label, loading = false, onChange } = item
	const [value, setValue] = useState<any[]>([])
	const [options, setOptions] = useState<any[]>([])
	const [defaultValue, setDefaultValue] = useState([''])
	useEffect(() => {
		if (JSON.stringify(defaultValue) !== JSON.stringify(value)) {
			if (onChange) {
				onChange(value)
			}
		}
		setDefaultValue(value)
	}, [value])

	const checkedListSearch = useMemo(() => {
		if (!isTrue(value)) {
			const data = { value: '', label: '全部' }
			setOptions([data])
			setValue([''])
		}
		class SearchCheckedListSearch extends BaseSearchCheckedListSearch {
			constructor() {
				super()
				this.setColumns(this.simpleCheckListSearch([{ name, value, setValue, label, options, setOptions }]))
			}
		}
		return new SearchCheckedListSearch().data
	}, [value])
	const CheckDom = (
		<Spin spinning={loading}>
			<CheckBox
				value={value}
				onChange={(item, optionsItem: any) => {
					setValue(item)
					setOptions(optionsItem)
				}}
				options={itemOptions}
			/>
		</Spin>
	)

	function setSearchData(item: any): ObjectMap {
		if (isTrue(value) && !isTrue(value[0])) {
			return item
		} else {
			item[name] = value
			return item
		}
	}

	return { checkedListSearch, CheckDom, setSearchData }
}
