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
			title: 'name',
			dataIndex: 'name',
			width: '25%',
			render(item) {
				console.log(item)
				return <Input />
			}
		}
	]

	const rowList = [
		{
			render() {
				return <FormTable value={value} formName={'test'} columns={mergedColumns} isForm={false} />
			}
		},
		{
			name: ['test', 0, 'name'],
			title: 'test1',
			component: () => <Input />
		},
		{
			name: ['test', 1, 'name'],
			title: 'test1',
			component: () => <Input />
		}
	]

	return (
		<div>
			<div>testFormTable</div>
			<div>
				<HtForm columns={rowList} value={value} onChange={setValue} setValue={setValue} />
				<Button
					onClick={() => {
						console.log(value)
					}}>
					查看
				</Button>
			</div>
		</div>
	)
}

export default View
