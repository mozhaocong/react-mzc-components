// 采购需求单

import { axiosGet } from 'html-mzc-tool'
import React, { useRef } from 'react'

import { searchPurchase } from '@/api/scm/purchase'
import { BaseSearchColumnsItem, BaseTableColumns, Input, SearchTable } from '@/components'

import { getSlotConfigData } from './config'

function orders(data = {}) {
	return axiosGet('http://crm_test.htwig.com/order/api/orders', data)
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
	return (
		<SearchTable
			search={{
				fId: 'searchTest',
				columns: new SearchColumn().data
			}}
			table={{ columns: new TableColumns().data, rowKey: 'no' }}
			useRequest={{
				apiRequest: searchPurchase,
				onSuccess(item, response) {
					console.log(item, response)
					return item?.data?.data
				}
			}}
		/>
	)
}

export default Index
