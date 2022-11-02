import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Space } from 'antd'
import React from 'react'

const { Option } = Select

const areas = [
	{ label: 'Beijing', value: 'Beijing' },
	{ label: 'Shanghai', value: 'Shanghai' }
]

const sights = {
	Beijing: ['Tiananmen', 'Great Wall'],
	Shanghai: ['Oriental Pearl', 'The Bund']
}

type SightsKeys = keyof typeof sights

const FormList = props => {
	const { name = '', rows = [] } = props
	return (
		<Form.List name={name}>
			{(fields, { add, remove }) => (
				<>
					{fields.map((field, index) => (
						<div key={index}>
							{rows.map(res => {
								return (
									<Form.Item {...field} label={res.label} name={[field.name, res.name]} rules={res.rules || []} key={JSON.stringify(res.name)}>
										{res.component()}
									</Form.Item>
								)
							})}
						</div>
					))}
					<Form.Item>
						<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
							Add sights
						</Button>
					</Form.Item>
				</>
			)}
		</Form.List>
	)
}

const App: React.FC = () => {
	const [form] = Form.useForm()

	const onFinish = (values: any) => {
		console.log('Received values of form:', values)
	}

	const handleChange = () => {
		form.setFieldsValue({ sights: [{}, {}] })
	}

	const data = [
		{ label: 'Sight', name: 'Sight', component: () => <Input /> },
		{ label: 'Price', name: 'Price', component: () => <Input /> }
	]

	return (
		<Form form={form} name='dynamic_form_nest_item' onFinish={onFinish} autoComplete='off'>
			<Form.Item name='area' label='Area'>
				<Select options={areas} onChange={handleChange} />
			</Form.Item>
			<FormList name={'sights'} rows={data} />
			<Form.Item>
				<Button type='primary' htmlType='submit'>
					Submit
				</Button>
			</Form.Item>
		</Form>
	)
}

export default App
