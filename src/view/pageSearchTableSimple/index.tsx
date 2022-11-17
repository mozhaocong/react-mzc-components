// 采购需求单

import { configBusinessDataOptions } from '@components/business/FormSelect/config'
import { useSimpleCheckDom } from '@components/model/reactHook'
import { Button } from 'antd'
import React from 'react'

import { BaseSearchColumnsItem, BaseTableColumns, FormSelect, Input, SearchTable } from '@/components'

import { getSlotConfigData } from './config'

export const defaultSearchSlotLayout = {
	col: { span: 6 }
}
export const defaultSearchLayout = {
	col: { span: 6 }
}

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
			{ ...getSlotConfigData({ name: 'purchaseParentOrderNoKey' })[0], ...defaultSearchSlotLayout }, // 母单号
			// ...getSlotConfigData({ name: 'purchaseParentOrderNoKey' }),
			{ label: '属性检索', name: 'spuProperties', component: () => <Input /> },
			// ...getSlotConfigData({ name: 'receiptTimeKey' }), // 收货时间
			{ ...getSlotConfigData({ name: 'receiptTimeKey' })[0], ...defaultSearchSlotLayout }, // 母单号
			{ label: '商品品牌', name: 'brand', component: () => <Input /> },
			{ label: '商品品类', name: 'no1', component: () => <Input /> },
			{ label: '采购数量', name: 'no2', component: () => <Input /> },
			{
				label: '特殊标记',
				name: 'customer_name',
				component: item => {
					return <FormSelect prop={'baseEffective'} mode={'multiple'} />
				},
				setChecked: (item: any) => {
					const option = configBusinessDataOptions['baseEffective']
					return this.simpleMultipleChecked({ option: option, item, labelText: '特殊标记', textKey: 'customer_name' })
				}
			}
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
		label: '采购状态',
		options: [
			{ label: '1', value: 1 },
			{ label: '2', value: 2 },
			{ label: '3', value: 3 }
		]
	})

	const SearchTableSlot = (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<div>
				<Button>新建采购单</Button>
			</div>
			{CheckDom}
		</div>
	)

	return (
		<SearchTable
			search={{
				...defaultSearchLayout,
				fId: 'searchTest',
				columns: new SearchColumn().data
			}}
			slot={SearchTableSlot}
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
