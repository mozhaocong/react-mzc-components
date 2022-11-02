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
				render(configure) {
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
									}
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

	return (
		<div>
			<div> FormAddFormList</div>
			<HtForm columns={new formData().data} value={value} onChange={setValue} setValue={setValue} valueData={valueData} />
			<Button
				onClick={() => {
					console.log('value', value)
				}}>
				value
			</Button>
		</div>
	)
}

export default View
