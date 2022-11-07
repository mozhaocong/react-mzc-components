import { isTrue } from 'html-mzc-tool'
import React, { useMemo, useState } from 'react'

import CheckBox from './CheckBox'
import { BaseSearchCheckedListSearch } from './classMethod'

interface setCheckDomType {
	name: string
	options: Array<{ label: string; value: any }>
	label: string
}

export function useSimpleCheckDom(item: setCheckDomType): {
	checkedListSearch: any
	CheckDom: React.ReactElement
	setSearchData: (item) => ObjectMap
} {
	const { name, options: itemOptions, label } = item
	const [value, setValue] = useState<any[]>([])
	const [options, setOptions] = useState<any[]>([])
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
		<CheckBox
			value={value}
			onChange={(item, optionsItem: any) => {
				setValue(item)
				setOptions(optionsItem)
			}}
			options={itemOptions}
		/>
	)

	function setSearchData(item: any): ObjectMap {
		item[name] = value.join(',')
		return item
	}

	return { checkedListSearch, CheckDom, setSearchData }
}
