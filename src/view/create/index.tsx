import { deepClone, isTrue } from 'html-mzc-tool'
import React from 'react'

import { BaseFormColumnsItem, BaseFormTableColumnsItem, Button, Col, DatePicker, Divider, FormSelect, HtForm, Input } from '@/components'
import { dataMomentToTimeData } from '@/utils'

import SupplementOrderProcessDtoList from './module/supplementOrderProcessDtoList'
const { useFormData, FormTable } = HtForm
class FormColumns extends BaseFormColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{
				label: '补款类型',
				name: 'supplementType',
				component: item => {
					const { setValue, valueData } = item
					return (
						<FormSelect
							onChange={() => {
								let data = deepClone(valueData.value)
								data = {
									...data,
									supplementOrderProcessDtoList: [{}],
									supplementOrderPurchaseDtoList: [{}]
								}
								setValue(data)
							}}
							prop={'supplementType'}
						/>
					)
				},
				rules: [{ required: true }]
			},
			{
				label: '供应商',
				display: item => {
					const { value } = item
					return value.supplementType === 'PROCESS'
				},
				name: 'supplierId',
				component: () => <Input />,
				rules: [{ required: true }]
			},
			{
				label: '补款员工',
				display: item => {
					const { value } = item
					return value.supplementType === 'PRICE'
				},
				name: 'supplementUser',
				component: () => <Input />,
				rules: [{ required: true }]
			},
			{ label: '约定结算时间', name: 'aboutSettleTime', component: () => <DatePicker />, rules: [{ required: true }] },
			{
				render: item => {
					const { value } = item
					return (
						<Col span={24}>
							<div>补款明细</div>
							<Divider />
							{value.supplementType === 'PRICE' && <SupplementOrderProcessDtoList {...item} />}
							{value.supplementType === 'PROCESS' && (
								<FormTable isForm={false} formName={'supplementOrderPurchaseDtoList'} columns={new TableColumns().data} {...item} />
							)}
							<div>凭证</div>
						</Col>
					)
				}
			}
		])
	}
}

class TableColumns extends BaseFormTableColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{
				title: '序号',
				render: item => {
					return this.serialNumber(item)
				}
			},
			{ title: '加工单', dataIndex: 'processOrderNo', render: () => <Input />, rules: [{ required: true }] },
			{ title: '补款金额', dataIndex: 'supplementPrice', render: () => <Input />, rules: [{ required: true }] },
			{ title: '补款描述', dataIndex: 'supplementRemarks', render: () => <Input />, rules: [{ required: true }] },
			{
				title: '操作',
				render: item => {
					return this.actionButton(item, 'supplementOrderPurchaseDtoList')
				}
			}
		])
	}
}

const Index: React.FC = () => {
	const { value, setValue, ...attributes } = useFormData({
		supplementOrderProcessDtoList: [{}],
		supplementOrderPurchaseDtoList: [{}]
	})

	async function onFinish(item: ObjectMap): Promise<void> {
		const { valueOtherData } = attributes
		item = dataMomentToTimeData(item)
		console.log('valueOtherData', valueOtherData, item)
		if (isTrue(item.supplementOrderPurchaseDtoList)) {
		}
		// item.supplementUsername = 'sagasgash'
		// item.supplierName = 'sagasgash'
		// item.supplementOrderProcessDtoList = item.supplementOrderProcessDtoList.map((item: any) => {
		//   item.processOrderId = '12512'
		//   return item
		// })
		// item.supplementOrderPurchaseDtoList = item.supplementOrderPurchaseDtoList.map((item: any) => {
		//   item.businessId = '12512'
		//   return item
		// })
		// const data = await addSupplementOrder(item)
	}
	return (
		<div>
			<div>
				<HtForm
					onFinish={onFinish}
					fId={'replenishmentNoteCreate'}
					columns={new FormColumns().data}
					{...{ ...attributes, value, setValue, onChange: setValue }}
				/>
				<div>
					<Button htmlType={'submit'} form={'replenishmentNoteCreate'}>
						确认提交
					</Button>
					<Button>返回</Button>
				</div>
			</div>
		</div>
	)
}

export default Index
