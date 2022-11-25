import CheckedTag from '@components/model/SearchTable/model/CheckedTag'
import { Input, Select } from 'antd'
import { deepClone, isString } from 'html-mzc-tool'
import React, { useEffect, useMemo, useState } from 'react'

import { Search } from '@/components'

const { setComponentMapData } = Search

setComponentMapData({ componentsInput: <Input /> })
const selectObjectMap = {
	CARGO: '大货采购单',
	PROCESS: '加工采购单',
	RETURN_GOODS: '退货单',
	SAMPLE_GOODS: '样品单'
}
const optionList = []
for (const key in selectObjectMap) {
	optionList.push({ label: selectObjectMap[key], value: key })
}
const data: any[] = [
	['tes1', { props: { allowClear: true }, component: 'input', name: 'test1' }],
	['tes2', { name: 'test2', props: {}, component: () => <Input /> }],
	[
		{ name: 'test3', component: 'componentsInput', col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test4', component: 'componentsInput' }
	],
	[
		{
			name: 'test5',
			component: () => <Select />,
			props: {
				options: optionList
			},
			col: { span: 6 }
		},
		{ name: 'test6', component: 'componentsInput' }
	],
	[
		{
			name: 'test7',
			component: () => <Select />,
			props: {
				options: optionList
			},
			col: { span: 6 }
		},
		{
			name: 'test8',
			component: () => <Select />,
			props: {
				options: optionList
			}
		}
	]
]

const SearchDom = () => {
	const defaultData = { test5: 'CARGO' }
	const [value, setValue] = useState<ObjectMap>(defaultData)
	const [checkValue, setCheckValue] = useState({})

	const searchColumns = useMemo(() => {
		return data
	}, [])

	const checkValueColumns = useMemo(() => {
		const data = []
		searchColumns.forEach(item => {
			if (isString(item[0])) {
				data.push({ name: item[1].name, label: item[0] })
			} else {
				data.push({ name: item[1].name, ...SearchMapCheckedTagLabel(item[1].name) })
			}
		})
		return data
	}, [searchColumns, value])

	useEffect(() => {
		let data = deepClone(value)
		data = { ...data, ...SearchMapCheckedTagValue() }
		setCheckValue(data)
	}, [value])

	function SearchMapCheckedTagLabel(key: string) {
		const { test3, test5, test7 } = value
		const data = {
			test4: { label: test3 },
			test6: { label: selectObjectMap[test5] },
			test8: { label: selectObjectMap[test7] }
		}
		return data[key] || {}
	}
	function SearchMapCheckedTagValue() {
		const data = {
			test8: selectObjectMap[value?.test8]
		}
		return data
	}

	return (
		<div>
			<Search value={value} onChange={setValue} columns={searchColumns} />
			<CheckedTag
				listSearch={[
					{
						value: checkValue,
						columns: checkValueColumns,
						onClose: (item, name) => {
							const data = deepClone(value)
							data[name] = undefined
							setValue(data)
						}
					}
				]}
			/>
		</div>
	)
}

export default React.memo(SearchDom)
