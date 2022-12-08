import { Button, Input, Select } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { Search, SearchChecked } from '@/components'

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

const columnsData: any[] = [
	['tes1', { props: { allowClear: true }, component: 'input', name: 'test1' }],
	['tes2', { name: 'test2', props: {}, component: () => <Input /> }],
	[
		{ name: 'test3', component: 'componentsInput', col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test4', component: 'componentsInput' }
	],
	[
		{ name: 'test5', component: () => <Select style={{ width: '100%' }} options={optionList} />, col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test6', component: 'componentsInput' }
	],
	[
		{ name: 'test7', component: () => <Select style={{ width: '100%' }} options={optionList} />, col: { span: 6 }, props: { allowClear: true } },
		{ name: 'test8', component: () => <Select style={{ width: '100%' }} options={optionList} /> }
	]
]

const View = () => {
	const [value, setValue] = useState<any>({})
	const searchDomRef = useRef<ObjectMap>()
	const [test, setTest] = useState({})

	const listSearch = useMemo(() => {
		return [{ value: test, onClose: setTest, columns: [{ name: 'test1', label: '测试1' }] }]
	}, [test])
	return (
		<div>
			<SearchChecked
				propsRef={searchDomRef}
				listSearch={listSearch}
				value={value}
				onChange={(value: any) => {
					console.log('onChange', value)
					setValue(value)
				}}
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
						// test8: selectObjectMap[value?.test8],
						test8: () => {
							return (
								<span className={'checked-span'}>
									test8自定义组件
									<Button
										onClick={() => {
											setValue({ ...value, test8: undefined })
											setTimeout(() => {
												searchDomRef.current?.onSubmit?.()
											}, 10)
										}}>
										删除
									</Button>
									<Button
										onClick={() => {
											searchDomRef.current?.onReset?.()
										}}>
										重置
									</Button>
								</span>
							)
						}
					}
					return data
				}}
			/>
			<Input
				onChange={item => {
					setTest({ test1: item.target.value })
				}}
			/>
			<div>----------------</div>
			<div>value {JSON.stringify(value)}</div>
			<div>test {JSON.stringify(test)}</div>
		</div>
	)
}

export default React.memo(View)
