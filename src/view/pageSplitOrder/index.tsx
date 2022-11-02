import { Button, Col, Input } from 'antd'
import { debounce, deepClone, isTrue } from 'html-mzc-tool'
import React from 'react'

import { BaseFormColumnsItem, BaseFormTableColumnsItem, HtForm } from '@/components'
import FormRadio from '@/components/business/FormRadio'
import FormSelect from '@/components/business/FormSelect'
const { FormTable, FormItem, useFormData } = HtForm

class formTable extends BaseFormTableColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{ title: '序号', render: item => this.serialNumber(item) },
			{
				dataIndex: 'a2',
				title: 'SKU',
				render: () => <Input />,
				width: 100
			},
			{
				dataIndex: 'a3',
				title: '变体属性',
				render: () => <Input />,
				width: 100
			},
			{ dataIndex: 'a4', title: '采购数', render: () => <Input />, width: 100 },
			{
				dataIndex: 'a5',
				title: '采购单价',
				render: () => <Input />,
				width: 100
			},
			{
				dataIndex: 'a6',
				title: '优惠类型',
				width: 200,
				render: () => <FormSelect prop={'supplierOfferType'} />
			},
			{
				dataIndex: 'a7',
				title: '扣减金额',
				render: () => <Input />,
				width: 100
			},
			{
				dataIndex: 'a8',
				title: '结算金额',
				render: () => <Input />,
				width: 100
			},
			{
				title: '操作',
				width: 200,
				render: item => {
					return this.actionButton(item, 'test1')
				}
			}
		])
	}
}

class formTable2 extends BaseFormTableColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{ dataIndex: 'a1', title: '序号', render: () => <Input /> },
			{
				dataIndex: 'a2',
				title: '原料SKU',
				render: () => <Input />,
				rules: [{ required: true }]
			},
			{ dataIndex: 'a3', title: '仓库库存', render: () => <Input /> },
			{ dataIndex: 'a4', title: '出库数', render: () => <Input /> },
			{
				dataIndex: 'a4',
				title: '操作',
				width: 300,
				render: item => {
					return this.actionButton(item, ['test2', 'b'])
				}
			}
		])
	}
}

function setFormTableValue(data, value, setValue) {
	if (isTrue(data)) {
		const { test2 } = value
		const cloneData = deepClone(value)
		if (!isTrue(test2)) {
			cloneData.test2 = {}
		}
		if (!isTrue(cloneData.test2.b)) {
			cloneData.test2.b = [{}]
			setValue(cloneData)
		}
	}
}

const debounceSetFormTableValue = debounce(setFormTableValue, 10)

class form extends BaseFormColumnsItem {
	constructor() {
		super()
		this.setColumns([
			{ name: 'c1', label: '供应商', component: () => <Input /> },
			{
				name: 'c2',
				label: '拆分类型',
				component: () => <FormRadio prop={'supplierSplitType'} />
			},
			{ name: 'c3', label: '送货仓库', component: () => <Input /> },
			{ name: 'c4', label: '采购约定交期', component: () => <Input /> },
			{ name: 'c5', label: '子单备注', component: () => <Input /> },
			{
				render: config => {
					return (
						<Col span={24}>
							<div>采购产品明细</div>
							<FormTable {...config} columns={new formTable().data} formName='test1' isForm={false} />
						</Col>
					)
				}
			},
			{
				render: config => {
					const { value, setValue } = config
					const { test1 = {} } = value
					const data = test1.filter(res => res.a6 === 1)
					debounceSetFormTableValue(data, value, setValue)
					return (
						<Col span={24}>
							{isTrue(data) && (
								<>
									<div>原料产品明细</div>
									<FormItem name={['test2', 'a']} component={() => <Input />} />
									<FormTable {...config} columns={new formTable2().data} formName={['test2', 'b']} isForm={false} />
								</>
							)}
						</Col>
					)
				}
			}
		])
	}
}

const View = () => {
	const { value, setValue, ...attrs } = useFormData({
		c1: '1',
		test1: [{ a2: 1 }, { a2: 2 }],
		test2: { b: [{ a2: 1 }], a: 2 }
	})
	return (
		<div>
			<HtForm wrapperCol={{ span: 12 }} {...attrs} value={value} setValue={setValue} onChange={setValue} columns={new form().data} />
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
