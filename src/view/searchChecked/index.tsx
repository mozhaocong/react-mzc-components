import { businessOptObject, configBusinessDataOptions } from '@components/business/FormSelect/config'
import CheckedTag from '@components/model/SearchTable/model/CheckedTag'
import { Input } from 'antd'
import { deepClone, isString } from 'html-mzc-tool'
import React, { useEffect, useMemo, useState } from 'react'

import { FormSelect, Search } from '@/components'

const { setComponentMapData } = Search

setComponentMapData({ componentsInput: <Input /> })

const data: any[] = [
	['tes1', { props: { allowClear: true }, component: 'input', name: 'test1' }],
	['tes2', { name: 'test2', props: {}, component: () => <Input /> }],
	[
		{ name: 'test3', component: 'componentsInput', col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test4', component: 'componentsInput' }
	],
	[
		{ name: 'test5', component: () => <FormSelect prop={'supplementOrderPurchaseType'} />, col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test6', component: 'componentsInput' }
	],
	[
		{ name: 'test7', component: () => <FormSelect prop={'supplementOrderPurchaseType'} />, col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test8', component: () => <FormSelect prop={'supplementOrderPurchaseType'} /> }
	]
]

const selectOption = configBusinessDataOptions['supplementOrderPurchaseType']
// console.log('selectOption', selectOption)
const selectObjectMap = businessOptObject['supplementOrderPurchaseType']
// console.log('selectObjectMap', selectObjectMap)
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
