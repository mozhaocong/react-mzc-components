import FormRadio from '@components/business/FormRadio'
import FormSelect from '@components/business/FormSelect'
import { debounce, deepClone, isTrue } from 'html-mzc-tool'
import React from 'react'

import { BaseFormColumnsItem, BaseFormTableColumnsItem, Button, Col, HtForm, Input } from '@/components'
const { FormTable, FormItem, useFormData } = HtForm

class FormTableColumns1 extends BaseFormTableColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{ title: '序号', render: item => this.serialNumber(item) },
			{ dataIndex: 'sku', title: 'SKU', render: () => <Input />, width: 100 },
			{ dataIndex: 'variantProperties', title: '变体属性', render: () => <Input />, width: 100 },
			{ dataIndex: 'purchaseCnt', title: '采购数', render: () => <Input />, width: 100 },
			{ dataIndex: 'purchasePrice', title: '采购单价', render: () => <Input />, width: 100 },
			{ dataIndex: 'discountType', title: '优惠类型', width: 200, render: () => <FormSelect prop={'purchaseDiscountType'} /> },
			{ dataIndex: 'substractPrice', title: '扣减金额', render: () => <Input />, width: 100 },
			{ dataIndex: 'settlePrice', title: '结算金额', render: () => <Input />, width: 100 },
			{
				title: '操作',
				width: 200,
				render: item => {
					return this.actionButton(item, 'purchaseProductItemList')
				}
			}
		])
	}
}

function setRawProductItemList(value: any, setValue: any, filterData: any): void {
	if (!isTrue(filterData)) {
		if (!isTrue(value.rawProductItemList)) return
		const data = deepClone(value)
		data.rawProductItemList = []
		setValue(data)
	} else {
		if (isTrue(value?.rawProductItemList)) return
		const data = deepClone(value)
		data.rawProductItemList = [{}]
		console.log(JSON.stringify(data))
		setValue(data)
	}
}

const setRawProductItemListDebounce: (value: any, setValue: any, filterData: any) => void = debounce(setRawProductItemList, 100)

class FormTableColumns2 extends BaseFormTableColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{ title: '序号', render: () => <Input /> },
			{
				dataIndex: 'sku',
				title: '原料SKU',
				render: () => <Input />,
				rules: [{ required: true }]
			},
			{ dataIndex: 'a3', title: '仓库库存', render: () => <Input /> },
			{ dataIndex: 'deliveryCnt', title: '出库数', render: () => <Input /> },
			{
				title: '操作',
				width: 300,
				render: item => {
					return this.actionButton(item, 'rawProductItemList')
				}
			}
		])
	}
}

class FormColumns extends BaseFormColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{ name: 'supplierCode', label: '供应商', component: () => <Input /> },
			{ name: 'purchaseBizType', label: '拆分类型', component: () => <FormRadio prop={'purchaseSplitType'} /> },
			{ name: 'deliverWarehouseCode', label: '送货仓库', component: () => <Input /> },
			{ name: 'deliverDate', label: '采购约定交期', component: () => <Input /> },
			{ name: 'orderRemarks', label: '子单备注', component: () => <Input /> },
			{
				render: config => {
					return (
						<Col span={24}>
							<div>采购产品明细</div>
							<FormTable {...config} columns={new FormTableColumns1().data} formName='purchaseProductItemList' isForm={false} />
						</Col>
					)
				}
			},

			{
				render: config => {
					const { value, setValue } = config
					const { purchaseProductItemList = [] } = value
					const data = purchaseProductItemList.filter((response: any) => response.discountType === 'PROVIDE_RAW')
					setRawProductItemListDebounce(value, setValue, data)
					return (
						<Col span={24}>
							{isTrue(data) && (
								<>
									<div>原料产品明细</div>
									{/* <FormItem name={['test2', 'a']} component={() => <Input />} /> */}
									<FormTable {...config} columns={new FormTableColumns2().data} formName={'rawProductItemList'} isForm={false} />
								</>
							)}
						</Col>
					)
				}

				// render: (config) => {
				//   const { value, setValue } = config
				//   const { purchaseProductItemList } = value
				//   const filterData = purchaseProductItemList.filter((item: any) => {
				//     return item.discountType === 'PROVIDE_RAW'
				//   })
				//   setRawProductItemListDebounce(value, setValue, filterData)
				//   if (isTrue(filterData)) {
				//     return (
				//       <Col span={24}>
				//         <div>原料产品明细</div>
				//         {/* <FormItem name={['test2', 'a']} component={() => <Input />} /> */}
				//         <FormTable {...config} columns={new FormTableColumns2().data} formName="rawProductItemList" isForm={false} />
				//       </Col>
				//     )
				//   } else {
				//     return <></>
				//   }
				// },
			}
		])
	}
}

const View: React.FC = () => {
	const { value, setValue, ...attributes } = useFormData({
		purchaseProductItemList: [{}]
	})
	return (
		<div>
			<HtForm wrapperCol={{ span: 12 }} {...attributes} value={value} setValue={setValue} onChange={setValue} columns={new FormColumns().data} />
			<Button
				onClick={() => {
					console.log(value)
				}}>
				查看
			</Button>
		</div>
	)
}
export default View
