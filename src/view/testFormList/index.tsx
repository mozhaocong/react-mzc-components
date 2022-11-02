import { Button, Form, Input, Select, Space } from 'antd'
import { deepClone } from 'html-mzc-tool'
import React from 'react'

import { HtForm } from '@/components'
const { useFormData, FormList } = HtForm

const App: React.FC = () => {
	const [form] = Form.useForm()

	const onFinish = (values: any) => {
		console.log('Received values of form:', values)
	}

	const handleChange = () => {
		form.setFieldsValue({ sights: [{}, {}] })
	}

	const { value, setValue, valueData } = useFormData({ test: [{}] })

	const data = [
		{
			label: 'Sight',
			name: 'Sight',
			component: item => {
				return (
					<Button
						onClick={() => {
							item.remove(item.field.name)
						}}>
						删除
					</Button>
				)
			}
		},
		{
			label: 'check',
			name: 'check',
			component: item => {
				return (
					<Button
						onClick={() => {
							console.log(item)
						}}>
						查看
					</Button>
				)
			}
		},
		{ label: 'Price', name: 'Price', component: () => <Input /> }
	]

	return (
		<>
			<FormList columns={data} formName={'test'} value={value} valueData={valueData} setValue={setValue} onChange={setValue} />
			<Button
				onClick={() => {
					const data = deepClone(value)
					data.test = [...data.test, {}]
					setValue(data)
				}}>
				添加
			</Button>
			<Button
				onClick={() => {
					console.log(value)
				}}>
				123456
			</Button>
		</>
	)
}

export default App
