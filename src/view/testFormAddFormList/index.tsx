import { Button, Input } from 'antd'
import React from 'react'

import { HtForm } from '@/components'
const { FormList, useFormData } = HtForm
class formData {
	data: any
	constructor() {
		this.data = [
			{
				label: 'Username',
				name: 'name',
				component: configure => <Input {...configure.publicProps} />
			},
			{
				label: '1',
				component: configure => {
					return (
						<FormList
							{...configure}
							columns={[
								{
									label: 'Price',
									name: ['test', 'a'],
									component: item => {
										console.log(item)
										return <Input />
									},
									rules: [{ required: true }]
								},
								{
									render(item) {
										return (
											<Button
												onClick={() => {
													item.add()
												}}>
												添加
											</Button>
										)
									}
								}
							]}
							formName={'test'}
							isForm={false}
						/>
					)
				}
			}
		]
	}
}

const View = () => {
	const { value, setValue, valueData } = useFormData({
		name: 'ASGASGA',
		test: [{}]
	})

	function onFinish(item) {
		console.log(item)
	}
	return (
		<div>
			<div> FormAddFormList</div>
			<HtForm
				fId={'FormAddFormList'}
				onFinish={onFinish}
				columns={new formData().data}
				value={value}
				onChange={setValue}
				setValue={setValue}
				valueData={valueData}
			/>
			<Button
				form={'FormAddFormList'}
				htmlType={'submit'}
				onClick={() => {
					console.log('value', value)
				}}>
				value
			</Button>
		</div>
	)
}

export default View
