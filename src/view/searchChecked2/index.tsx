import { businessOptObject, configBusinessDataOptions } from '@components/business/FormSelect/config'
import CheckedTag from '@components/model/SearchTable/model/CheckedTag'
import { Input } from 'antd'
import { deepClone, isString } from 'html-mzc-tool'
import React, { useEffect, useMemo, useState } from 'react'

import { FormSelect, Search } from '@/components'

const { setComponentMapData } = Search

setComponentMapData({ componentsInput: <Input /> })

const columnsData: any[] = [
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

const View = () => {
	const [value, setValue] = useState<any>({})
	return (
		<div>
			<SearchDom
				value={value}
				onChange={setValue}
				columns={columnsData}
				labelMap={() => {
					const { test3, test5, test7 } = value
					const data = {
						test4: { label: test3 },
						test6: { label: selectObjectMap[test5] },
						test8: { label: selectObjectMap[test7] }
					}
					return data
				}}
				valueMap={() => {
					const data = {
						test8: selectObjectMap[value?.test8]
					}
					return data
				}}
			/>
			<div>----------------</div>
			{JSON.stringify(value)}
		</div>
	)
}

type SearchDomType = {
	value: ObjectMap
	onChange: any
	columns: any[]
	labelMap?: () => ObjectMap
	valueMap?: () => ObjectMap
	formProps?: ObjectMap
}

const SearchDom: React.FC<SearchDomType> = props => {
	const { value, onChange, formProps, valueMap, labelMap, columns } = props
	const [checkValue, setCheckValue] = useState({})

	const searchColumns = useMemo(() => {
		return columns
	}, [columns])

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
		// const { test3, test5, test7 } = value
		// const data = {
		// 	test4: { label: test3 },
		// 	test6: { label: selectObjectMap[test5] },
		// 	test8: { label: selectObjectMap[test7] }
		// }
		return labelMap()?.[key] || {}
	}
	function SearchMapCheckedTagValue() {
		// const data = {
		// 	test8: selectObjectMap[value?.test8]
		// }
		return valueMap() || {}
	}

	return (
		<div>
			<Search value={value} onChange={onChange} columns={searchColumns} {...formProps} />
			<CheckedTag
				listSearch={[
					{
						value: checkValue,
						columns: checkValueColumns,
						onClose: (item, name) => {
							const data = deepClone(value)
							data[name] = undefined
							onChange(data)
						}
					}
				]}
			/>
		</div>
	)
}

export default React.memo(View)
