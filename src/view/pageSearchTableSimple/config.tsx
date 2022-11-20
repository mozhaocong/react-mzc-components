import { arrayGetData, isTrue } from 'html-mzc-tool'
import { curry } from 'ramda'
import React from 'react'

import { BaseSearchColumnsItem, DatePicker, Input } from '@/components'
import { getSlotKey, getSlotListKey } from '@/view/_module/list/searchListData'
const { RangePicker } = DatePicker

export class SlotConfigData extends BaseSearchColumnsItem {
	constructor() {
		super()
		this.setColumns([
			this.simpleInputSlot({ slotList: getSlotListKey([{ label: '母单号' }, { label: 'SPU' }, { label: 'SKU' }]) }),
			this.simpleRangePickerSlot({
				slotList: getSlotListKey([{ label: '收货时间' }, { label: '质检时间' }, { label: '入库时间' }, { label: '退货时间' }])
			})

			// {
			// 	name: 'receiptTimeKey',
			// 	selectSlot: {
			// 		selectNane: 'receiptTimeKey', // form表单的Name
			// 		optionNane: 'receiptTimeValue',
			// 		initialValue: {
			// 			select: getSlotKey({ label: '收货时间' })
			// 		},
			// 		component: () => {
			// 			return <RangePicker format='YYYY-MM-DD' />
			// 		},
			// 		slotList: getSlotListKey([{ label: '收货时间' }, { label: '质检时间' }, { label: '入库时间' }, { label: '退货时间' }])
			// 	},
			// 	setChecked: (item: any) => {
			// 		return this.simpleRangePickerChecked({ item, labelKey: 'receiptTimeKey', textKey: 'receiptTimeValue' })
			// 	},
			// 	setSearchData: (item: any) => {
			// 		return this.simpleRangePickerSearchData({ item, mapKeys: 'testD3', textKey: 'receiptTimeValue' })
			// 	}
			// }
		])
	}
}

function getData(item: any, getData: any): ObjectMap[] {
	return arrayGetData(item, getData)
}

const getDataCurry = curry(getData)
export const getSlotConfigData: any = getDataCurry(new SlotConfigData().data)
