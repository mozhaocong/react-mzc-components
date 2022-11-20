import { setSlotComponents } from '@components/model/SearchTable/model/setSlotComponents'
import React from 'react'

import { HtForm, Input } from '@/components'
const { useFormData } = HtForm

const data = {
	selectSlot: {
		name: 'purchaseParentOrderNoKey',
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

const View = () => {
	const { ...attrs } = useFormData({})
	const { setValue, value } = attrs
	return (
		<div>
			<HtForm onChange={setValue} columns={[{ render: index => setSlotComponents(data, index) }]} {...attrs} />
			<div>{JSON.stringify(value)}</div>
		</div>
	)
}
export default View
