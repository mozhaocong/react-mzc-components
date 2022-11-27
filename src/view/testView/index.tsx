import { DatePicker, Input, Select } from 'antd'
const { RangePicker } = DatePicker
import React, { useState } from 'react'

import { Search } from '@/components'
const selectObjectMap = {
	CARGO: '供应商代码',
	PROCESS: '供应商名称'
}
const optionList = []
for (const key in selectObjectMap) {
	optionList.push({ label: selectObjectMap[key], value: key })
}
const data = [
	[
		{
			name: 'test1',
			component: () => <Select />,
			props: {
				options: optionList
			}
			// col: { span: 6 }
		},
		{ name: 'test2', component: () => <Input /> }
	],
	['赫特SPU', { name: 'test3', component: () => <Input /> }],
	[
		'供应商等价',
		{
			name: 'test4',
			component: () => <Select />,
			props: {
				options: [
					{ value: 'a', label: 'a' },
					{ value: 's', label: 's' }
				]
			}
		}
	],
	['入驻时间', { name: 'test5', component: () => <RangePicker /> }]
]
const View: React.FC = () => {
	const [value, setValue] = useState({})
	return (
		<div>
			<Search value={value} onChange={setValue} columns={data} col={{ span: 6 }} />
			<div>----</div>
			<div>{JSON.stringify(value)}</div>
		</div>
	)
}

export default React.memo(View)
