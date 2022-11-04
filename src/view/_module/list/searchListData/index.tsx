import { arrayGetDataList } from 'html-mzc-tool'
import { curry } from 'ramda'

const slotListKeyMap = [
	{ label: '母单号', key: 'purchaseParentOrderNo' },
	{ label: 'SPU', key: 'spu' },
	{ label: 'SKU', key: 'sku' },
	{ label: '收货时间', key: 'receiptTime' },
	{ label: '质检时间', key: 'qcTime' },
	{ label: '入库时间', key: 'warehousingTime' },
	{ label: '退货时间', key: 'returnTime' },
	{ label: '下单人', key: 'placeOrderUsername' },
	{ label: '审核人', key: 'reviewUsername' },
	{ label: '下单时间', key: 'a1' },
	{ label: '审核时间', key: 'a2' },
	{ label: '确认时间', key: 'a3' },
	{ label: '支付完成时间', key: 'a3' },
	{ label: '采购约定时间', key: 'a4' }
] as const

type slotListKeyMapDataType = typeof slotListKeyMap
type labelType = {
	[k in keyof slotListKeyMapDataType]: slotListKeyMapDataType[k] extends { label: infer G } ? G : never
}[keyof slotListKeyMapDataType]

type keytype = {
	[k in keyof slotListKeyMapDataType]: slotListKeyMapDataType[k] extends { key: infer G } ? G : never
}[keyof slotListKeyMapDataType]

function setData(tableList: any[], getDataList: ObjectMap[]): ObjectMap[] {
	return arrayGetDataList(tableList, getDataList)
}

const setDataCurry = curry(setData)
export const getSlotListKey: (item: Array<{ label?: labelType; key?: keytype }>) => any[] =
	// @ts-expect-error
	setDataCurry(slotListKeyMap)

export const getSlotKey: (item: { label?: labelType; key?: keytype }) => string = item => {
	return getSlotListKey([item])[0].key
}
