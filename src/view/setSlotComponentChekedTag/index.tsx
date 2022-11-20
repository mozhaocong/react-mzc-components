import CheckedTag from '@components/model/SearchTable/model/CheckedTag'
import { setSlotComponents } from '@components/model/SearchTable/model/setSlotComponents'
import { Tag } from 'antd'
import { arrayGetData, isTrue } from 'html-mzc-tool'
import React from 'react'

import { HtForm, Input } from '@/components'
const { useFormData } = HtForm

const data = {
	name: 'purchaseParentOrderNoKey',
	selectSlot: {
		initialValue: {
			select: 'a'
		},
		placeholder: '母单号',
		component: () => {
			return <Input />
		},
		slotList: [
			{ label: '母单号', key: 'a' },
			{ label: 'SPU', key: 'b' },
			{ label: 'SKU', key: 'c' }
		]
	}
}

const listSearchColumns = [
	{
		name: 'purchaseParentOrderNoKey',
		setChecked: item => {
			const { slotComponents, nameData } = item
			const {
				selectSlot: { slotList }
			} = slotComponents
			const { select = '', option = '' } = nameData
			if (!isTrue(option)) return <></>
			const labelList = arrayGetData(slotList, { key: select })
			const closeTag = (e, item) => {
				e.preventDefault()
				const { value, name, onClose } = item
				const data = { ...value }
				if (data?.[name]?.['option']) {
					data[name]['option'] = undefined
				}
				onClose(data)
			}
			return (
				<span>
					<span>{labelList?.[0]?.label}:</span>
					<Tag closable onClose={e => closeTag(e, item)}>
						{option}
					</Tag>
				</span>
			)
		}
	}
]

const View = () => {
	const { ...attrs } = useFormData({})
	const { setValue, value } = attrs
	return (
		<div>
			<div>{JSON.stringify(value)}</div>
			<HtForm onChange={setValue} columns={[{ render: index => setSlotComponents(data, index) }]} {...attrs} />
			<CheckedTag
				listSearch={[
					{
						value: value,
						columns: listSearchColumns,
						slotComponents: data,
						onClose: item => {
							setValue(item)
						}
					}
				]}
			/>
		</div>
	)
}
export default View
