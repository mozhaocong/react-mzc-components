import { Button } from 'antd'
import React, { useState } from 'react'

import { CheckBox } from '@/components'
const data = [
	{ label: '待确认', value: 'a1' },
	{ label: '待核算', value: 'a2' },
	{ label: '结算待核算', value: 'a3' },
	{ label: '已审核', value: 'a4' },
	{ label: '部分结算', value: 'a5' },
	{ label: '已结算', value: 'a6' }
]
const View = () => {
	const [value, setValue] = useState([])

	return (
		<>
			<CheckBox
				value={value}
				onChange={setValue}
				onChangeLabel={item => {
					console.log(item)
				}}
				options={data}
			/>
			<Button
				onClick={() => {
					console.log(value)
				}}>
				查看
			</Button>
		</>
	)
}
export default View
