import { Input, Tag } from 'antd'
import { axiosGet, isTrue } from 'html-mzc-tool'
import React, { useMemo, useState } from 'react'

import { BaseSearchCheckedListSearch, BaseSearchColumnsItem, CheckBox, SearchTable } from '@/components'

class searchColumn extends BaseSearchColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{
				label: '编号检索',
				name: 'no',
				component: () => <Input />
			},
			{ label: '客户检索', name: 'customer_name', component: () => <Input /> },
			{ label: '运单号', name: 'shipping_no', component: () => <Input /> },
			{ label: '订单类型', name: 'type', component: () => <Input /> },
			{ label: '发货方式', name: 'delivery_type', component: () => <Input /> }
		])
	}
}
function orders(data = {}) {
	return axiosGet('http://crm_test.htwig.com/order/api/orders', data)
}

const tableColumns = [
	{
		title: '订单信息',
		dataIndex: 'no1'
	},
	{
		title: '产品信息',
		dataIndex: 'category_name'
	},
	{
		title: '费用信息',
		dataIndex: 'total_price'
	},
	{
		title: '更新时间',
		dataIndex: 'updated_at'
	},
	{
		title: '日期',
		dataIndex: 'plat_created_time'
	}
]

const View = () => {
	const [value, setValue] = useState([])
	const [options, setOptions] = useState([])

	const CheckDom = (
		<CheckBox
			value={value}
			onChange={(item, optionsItem) => {
				setValue(item)
				setOptions(optionsItem)
			}}
			options={[
				{ label: '待确认', value: 'a1' },
				{ label: '待核算', value: 'a2' },
				{ label: '结算待核算', value: 'a3' },
				{ label: '已审核', value: 'a4' },
				{ label: '部分结算', value: 'a5' },
				{ label: '已结算', value: 'a6' }
			]}
		/>
	)

	// 原始的多选
	// const listSearchOriginal = useMemo(() => {
	// 	const listSearch = [
	// 		{
	// 			columns: [
	// 				{
	// 					label: '测试点击',
	// 					name: 'test12',
	// 					setChecked: () => {
	// 						function closeTag(e: any, res: any) {
	// 							e.preventDefault()
	// 							const filterData = value.filter(item => item !== res.value)
	// 							const filterOptions = options.filter(item => item.value !== res.value)
	// 							setValue(filterData)
	// 							setOptions(filterOptions)
	// 						}
	// 						return (
	// 							<div>
	// 								<span>测试点击</span>
	// 								{options.map(res => {
	// 									return (
	// 										<Tag closable onClose={e => closeTag(e, res)}>
	// 											{res.label}
	// 										</Tag>
	// 									)
	// 								})}
	// 							</div>
	// 						)
	// 					}
	// 				}
	// 			],
	// 			value: { test12: value }
	// 		}
	// 	]
	// 	return listSearch
	// }, [value])

	// 封装setChecked的
	// const listSearch = useMemo(() => {
	// 	return [
	// 		{
	// 			columns: [
	// 				{
	// 					label: '测试点击',
	// 					name: 'test12',
	// 					setChecked: () => {
	// 						return simpleCheckBoxSetChecked({ value, setValue, label: '测试点击', options, setOptions })
	// 					}
	// 				}
	// 			],
	// 			value: { test12: value }
	// 		}
	// 	]
	// }, [value])

	const listSearch = useMemo(() => {
		if (!isTrue(value)) {
			const data = { value: '', label: '全部' }
			setOptions([data])
			setValue([''])
		}

		class SearchCheckedListSearch extends BaseSearchCheckedListSearch {
			constructor() {
				super()
				this.setColumns(this.simpleCheckListSearch([{ name: 'test12', value, setValue, label: '测试点击', options, setOptions }]))
			}
		}
		return new SearchCheckedListSearch().data
	}, [value])

	return (
		<SearchTable
			search={{
				fId: 'searchTest',
				columns: new searchColumn().data
			}}
			table={{ columns: tableColumns, rowKey: 'no' }}
			useRequest={{
				// defaultParams: { is_simple: 0 },
				apiRequest: orders,
				onSuccess(item, res) {
					return item?.data?.data
				}
			}}
			checkedListSearch={listSearch}
			slot={CheckDom}
		/>
	)
}

export default View
