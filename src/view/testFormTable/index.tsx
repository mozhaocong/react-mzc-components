import { Button, Input } from 'antd'
import React from 'react'

import { HtForm } from '@/components'
const { useFormData, FormTable } = HtForm

// function get

const View = () => {
	const { value, setValue } = useFormData({
		test: [{ name: '1' }, { name: '2' }, { name: '3' }]
	})

	const mergedColumns = [
		{
			rules: [{ required: true }],
			title: 'name',
			dataIndex: 'name',
			width: '25%',
			render(item) {
				console.log(item)
				return <Input />
			}
		}
	]

	return (
		<div>
			<div>testFormTable</div>
			<div>
				<FormTable
					fId={'formTable'}
					value={value}
					formName={'test'}
					columns={mergedColumns}
					onChange={setValue}
					setValue={setValue}
					onFinish={value => {
						console.log('onFinish', value)
					}}
				/>

				<Button
					htmlType={'submit'}
					form={'formTable'}
					// onClick={() => {
					//   console.log(value)
					// }}
				>
					查看
				</Button>
			</div>
		</div>
	)
}

export default View
