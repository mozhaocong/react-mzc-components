// 采购需求单

import { useSimpleCheckDom } from '@components/model/reactHook'
import React from 'react'

import { BaseSearchColumnsItem, BaseTableColumns, Input, SearchTable } from '@/components'

import { getSlotConfigData } from './config'

function orders(data = {}) {
	console.log(data)
	return new Promise(resolve => {
		resolve({ data: [] })
	})
}

class SearchColumn extends BaseSearchColumnsItem {
	constructor() {
		super()
		this.setColumns([
			...getSlotConfigData({ name: 'purchaseParentOrderNoKey' }), // 母单号
			{ label: '属性检索', name: 'spuProperties', component: () => <Input /> },
			...getSlotConfigData({ name: 'receiptTimeKey' }), // 收货时间
			{ label: '商品品牌', name: 'brand', component: () => <Input /> },
			{ label: '商品品类', name: 'no1', component: () => <Input /> },
			{ label: '采购数量', name: 'no2', component: () => <Input /> },
			{ label: '特殊标记', name: 'customer_name', component: () => <Input /> }
		])
	}
}

class TableColumns extends BaseTableColumns {
	constructor() {
		super()
		this.setColumns([
			{ title: '样品需求单号', dataIndex: 'a1' },
			{ title: '赫特SPU款号', dataIndex: 'a2' },
			{ title: '采购数量', dataIndex: 'a3' },
			{ title: '下单时间', dataIndex: 'a4' },
			{ title: '开款时间', dataIndex: 'a4' },
			{ title: '确认打版时间', dataIndex: 'a4' },
			{ title: '接单时间', dataIndex: 'a4' },
			{ title: '选择时间', dataIndex: 'a4' },
			{ title: '业务约定交期', dataIndex: 'a4' },
			{ title: '开款人', dataIndex: 'a4' }
		])
	}
}

const Index: React.FC = () => {
	const { setSearchData, checkedListSearch, CheckDom } = useSimpleCheckDom({
		name: 'sagas',
		label: '嘎说',
		options: [
			{ label: '1', value: 1 },
			{ label: '2', value: 2 },
			{ label: '3', value: 3 }
		]
	})

	return (
		<SearchTable
			search={{
				fId: 'searchTest',
				columns: new SearchColumn().data
			}}
			slot={CheckDom}
			table={{ columns: new TableColumns().data, rowKey: 'no' }}
			useRequest={{
				apiRequest: orders,
				onSuccess(item, response) {
					console.log(item, response)
					return item?.data?.data
				},
				setSearchData(item) {
					return setSearchData(item)
				}
			}}
			checkedListSearch={checkedListSearch}
		/>
	)
}

export default Index
