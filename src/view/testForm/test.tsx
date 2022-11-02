import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'

const App = props => {
	const onFinish = (values: any) => {
		console.log('Success:', values)
	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}

	const configure = {
		disabled: true
	}

	const [form] = useForm()

	useEffect(() => {
		const data = form.getFieldsValue()
		for (const dataKey in data) {
			data[dataKey] = null
		}
		form.setFieldsValue({ ...data, ...props.value } || {})
	}, [props.value])

	return (
		<Form
			name='basic'
			form={form}
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			initialValues={{ remember: true }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete='off'
			onValuesChange={() => {
				if (props.onChange) {
					props.onChange(form.getFieldsValue())
				}
			}}>
			{props.rows?.map((item: any) => {
				if (item.display) {
					if (item.display() === false) {
						return false
					}
				}
				if (item.render) {
					return item.render(item)
				}
				return (
					<Form.Item label={item.label} name={item.name} rules={item.rules} key={item.name}>
						{item.components(configure)}
					</Form.Item>
				)
			})}

			<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
				<Button type='primary' htmlType='submit'>
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}

export default App
