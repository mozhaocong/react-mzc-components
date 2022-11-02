import { Form, Input, Select } from 'antd'
import React from 'react'

import { MinMaxInput } from '@/components'
const { Option } = Select

export class formRows {
	data: any
	constructor(item) {
		this.data = [
			{
				label: 'Username',
				name: 'name',
				component: configure => {
					return <Input {...configure.publicProps} />
				}
			},
			{
				label: 'Password',
				initialValue: 1,
				name: 'Password',
				component: configure => <Input {...configure.publicProps} />
			},
			{ slotName: 'spPlatform' },
			{
				label: 'Password',
				name: 'min',
				display: configure => {
					return item?.value?.name !== '123456'
				},
				component: configure => (
					// @ts-ignore
					<MinMaxInput {...configure.publicProps} />
				)
			}
			// {
			//   render: (configure) => {
			//     return (
			//       <Form.Item label="Address">
			//         <Form.Item
			//           name={['address', 'province']}
			//           noStyle
			//           rules={[{ required: true, message: 'Province is required' }]}
			//         >
			//           <Select
			//             placeholder="Select province"
			//             onChange={() => {
			//               console.log('onChange', configure)
			//             }}
			//           >
			//             <Option value="Zhejiang">Zhejiang</Option>
			//             <Option value="Jiangsu">Jiangsu</Option>
			//           </Select>
			//         </Form.Item>
			//         <Form.Item
			//           name={['address', 'street']}
			//           noStyle
			//           rules={[{ required: true, message: 'Street is required' }]}
			//         >
			//           <Input style={{ width: '50%' }} placeholder="Input street" />
			//         </Form.Item>
			//       </Form.Item>
			//     )
			//   }
			// }
		]
	}
}

export const pageSate = {
	spPlatform: {
		// 组件列表slot name
		selectNane: ['spPlatform', 'select'], // form表单的Name
		optionNane: ['spPlatform', 'option'],
		initialValue: {
			select: 'sellerSku',
			option: 1
		},
		rules: [], //form 的 rules
		label: '', //form 的 label
		placeholder: 'Select province',
		slotType: 'selectOption', // 组件模式
		component: () => {
			return <Input />
		},
		slotList: [
			{
				label: '创建人',
				// initialValue: 2,
				key: 'sku'
				// name: 'c1',
				// component: () => <Input placeholder="sku" />
			},
			{
				label: '销售负责人',
				// initialValue: 3,
				key: 'sellerSku'
				// name: 'c1',
				// component: () => <Input placeholder="sellerSku" />
			}
		],
		value: {}
	}
}
