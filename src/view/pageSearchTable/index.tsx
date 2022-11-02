import { DatePicker, Input } from 'antd'
import { axiosGet } from 'html-mzc-tool'
import React from 'react'

import { BaseSearchColumnsItem, SearchTable } from '@/components'
const { RangePicker } = DatePicker
import moment from 'moment'

function orders(data = {}) {
	return axiosGet('http://crm_test.htwig.com/order/api/orders', data)
}

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
			{ label: '发货方式', name: 'delivery_type', component: () => <Input /> },
			{
				name: 'rangePicker',
				selectSlot: {
					selectNane: ['rangePicker', 'type'], // form表单的Name
					optionNane: ['rangePicker', 'value'],
					initialValue: {
						select: 'createTime'
					},
					component: () => {
						return <RangePicker format='YYYY-MM-DD' />
					},
					slotList: [
						{ label: '创建时间', key: 'createTime' },
						{ label: '更新时间', key: 'updateTime' }
					]
				},
				setChecked: (item: any) => {
					return this.baseSetChecked({
						item: item,
						label: 'typeLabel',
						setOption: (item, nameData) => {
							const data = this.momentToArray(nameData?.value)
							// nameData?.value?.map(res => {
							// 	return moment(res).format('YYYY-MM-DD')
							// }) || []
							return data.join(',')
						},
						closeName: ['rangePicker', 'value'],
						propsName: 'rangePicker'
					})
				},
				setSearchData(item, nameData) {
					const data =
						nameData.value?.map(res => {
							return moment(res).format('YYYY-MM-DD')
						}) || []
					item.rangePickerType = nameData.type
					item.rangePickerData = data.join(',')
					delete item.rangePicker
					return item
				}
			}
		])
	}
}

const tableColumns = [
	{
		title: '订单信息',
		dataIndex: 'no'
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
					console.log(item, res)
					return item?.data?.data
				}
			}}
		/>
	)
}

export default View
