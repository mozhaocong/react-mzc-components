// 采购需求单

import { businessOptObject, configBusinessDataOptions } from '@components/business/FormSelect/config'
import { useSimpleCheckDom } from '@components/model/reactHook'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import { searchPurchase } from '@/api/scm/purchase'
import { BaseSearchColumnsItem, BaseTableColumns, FormSelect, Input, MinMaxInput, SearchTable } from '@/components'
const { useSearchRef } = SearchTable

import { getSlotListKey } from '@/view/_module/list/searchListData'

export const defaultSearchSlotLayout = {
	col: { flex: '360px' }
}
export const defaultSearchLayout = {
	col: { flex: '360px' }
}

class SearchColumn extends BaseSearchColumnsItem {
	constructor() {
		super()
		this.setColumns([
			this.simpleInputSlot({
				slotList: getSlotListKey([{ label: '母单号' }, { label: 'SPU' }, { label: 'SKU' }]),
				selectSlotOption: defaultSearchSlotLayout,
				setCheckedValue: (nameValue, item) => {
					console.log(item)
					return businessOptObject['supplementOrderPurchaseType'][nameValue]
				},
				component: () => <FormSelect prop={'supplementOrderPurchaseType'} />
			}),
			this.simpleRangePickerSlot({
				slotList: getSlotListKey([{ label: '收货时间' }, { label: '质检时间' }, { label: '入库时间' }, { label: '退货时间' }]),
				selectSlotOption: defaultSearchSlotLayout
			}),
			{ label: '数量', name: 'nub', component: () => <MinMaxInput /> },

			// { ...getSlotConfigData({ name: 'purchaseParentOrderNoKey' })[0], ...defaultSearchSlotLayout }, // 母单号
			// ...getSlotConfigData({ name: 'purchaseParentOrderNoKey' }),
			{
				label: '属性检索',
				name: 'spuProperties',
				component: () => <Input />,
				setSearchData: (item, nameData) => {
					console.log('setSearchData', item, nameData)
					return item
				}
			},
			// ...getSlotConfigData({ name: 'receiptTimeKey' }), // 收货时间
			// { ...getSlotConfigData({ name: 'receiptTimeKey' })[0], ...defaultSearchSlotLayout }, // 母单号
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
	const searchRef = useSearchRef()
	const [loading, setLoading] = useState(false)
	const data = useRef<any>({})
	useEffect(() => {
		console.log('searchRef', JSON.stringify(searchRef.current))
	}, [searchRef])
	const { setSearchData, checkedListSearch, CheckDom } = useSimpleCheckDom({
		loading: loading,
		name: 'sagas',
		label: '采购状态',
		options: [
			{ label: '1', value: 1 },
			{ label: '2', value: 2 },
			{ label: '3', value: 3 }
		],
		onChange: item => {
			data.current = item
			console.log(searchRef)
			searchRef?.current?.refresh()
		}
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
		<div>
			<SearchTable
				searchRef={searchRef}
				search={{
					...defaultSearchLayout,
					fId: 'searchTest',
					columns: new SearchColumn().data
				}}
				onLoadingChange={setLoading}
				slot={SearchTableSlot}
				// tableSlot={() => <div>123456</div>}
				table={{ columns: new TableColumns().data, rowKey: 'no' }}
				useRequest={{
					apiRequest: searchPurchase,
					defaultParams: {
						test1: 1
					},
					onSuccess: (item, response) => {
						return item?.data?.data
					},
					onCallBack: () => {
						// setLoading(false)
					},
					setSearchData: item => {
						// setLoading(true)
						return setSearchData(item)
					}
				}}
				checkedListSearch={checkedListSearch}
			/>
		</div>
	)
}

export default Index
