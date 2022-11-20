import CheckedTag from '@components/model/SearchTable/model/CheckedTag'
import { Input, Tag } from 'antd'
import React, { useState } from 'react'
const View = () => {
	const [value, setValue] = useState<ObjectMap>({})
	const [value2, setValue2] = useState<ObjectMap>({})

	return (
		<div>
			<div>Input 1</div>
			{JSON.stringify(value)}
			<Input
				value={value.a}
				onChange={item => {
					setValue({ a: item.target.value })
				}}
			/>
			<div>Input 2</div>
			{JSON.stringify(value2)}
			<Input
				value={value2.a}
				onChange={item => {
					setValue2({ ...value2, a: item.target.value })
				}}
			/>
			<Input
				value={value2.b}
				onChange={item => {
					setValue2({ ...value2, b: item.target.value })
				}}
			/>
			<CheckedTag
				listSearch={[
					{
						value,
						columns: [{ label: '测试1', name: 'a' }],
						onClose: item => {
							console.log(item)
							setValue(item)
						}
					},
					{
						value: value2,
						columns: [
							{ label: '测试2', name: 'a' },
							{
								label: '测试setChecked',
								name: 'b',
								setChecked: item => {
									console.log(item)
									const { label, nameData } = item
									const closeTag = (e, item) => {
										e.preventDefault()
										const { value, name, onClose } = item
										const data = { ...value }
										data[name] = undefined
										onClose(data)
									}
									return (
										<span>
											<span>{label}:</span>
											<Tag closable onClose={e => closeTag(e, item)}>
												{nameData}
											</Tag>
										</span>
									)
								}
							}
						],
						onClose: item => {
							setValue2(item)
						}
					}
				]}
			/>
		</div>
	)
}

export default React.memo(View)
