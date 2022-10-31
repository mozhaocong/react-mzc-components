import { Form, Row, Spin } from 'antd'
import React, { useEffect, useRef } from 'react'
import { useFormData, setSlotComponents } from './uitls'
import FormItem from './components/formItem'
import FormList from './components/formList'
import FormTable from './components/formTable'
import { _FormType } from './indexType'
import { isTrue } from 'html-mzc-tool'
import { setFormNameToValue } from './uitls/tool'

let _Form = (props: _FormType) => {
	const {
		fId,
		loading,
		columns,
		labelCol = { span: 8 },
		wrapperCol = { span: 8 },
		col = { span: 8 },
		labelAlign = 'right',
		style,
		onChange,
		propsForm,
		form: propsFormRef,
		value,
		valueData,
		setValue,
		valueOtherData = {},
		publicProps = {},
		onFinish: propsOnFinish,
		...attrs
	} = props
	let [form] = Form.useForm()
	if (propsFormRef) {
		form = propsFormRef
	}
	const isInitialValues = useRef(true)
	const onFinish = values => {
		if (propsOnFinish) {
			propsOnFinish(values)
		}
	}

	// const onFinishFailed = (errorInfo) => {}
	useEffect(() => {
		if (propsForm) {
			propsForm(form)
		}
	}, [])

	useEffect(() => {
		const data = form.getFieldsValue()

		// form 数据和value保持一致， 所以以value为主
		if (!isInitialValues.current) {
			for (const dataKey in data) {
				data[dataKey] = null
			}
		}

		form.setFieldsValue({ ...data, ...value } || {})
		// initialValues 第一次时 把数据传回value
		if (isInitialValues.current && isTrue(onChange)) {
			onChange({ ...data, ...value })
		}
		isInitialValues.current = false
	}, [value])

	return (
		<div style={style}>
			<Spin spinning={loading ?? false}>
				<Form
					{...{ labelCol, wrapperCol, ...attrs }}
					form={form}
					id={fId || 'fromID'}
					onFinish={onFinish}
					autoComplete='off'
					onValuesChange={() => {
						if (onChange) {
							onChange(form.getFieldsValue())
						}
						if (propsForm) {
							propsForm(form)
						}
					}}>
					<Row style={{ margin: 0 }}>
						{columns.map((item, index) => {
							const { labelAlign: itemLabelAlign, col: itemCol, name, ...columnAttrs } = item
							return (
								<FormItem
									key={'FormItem' + JSON.stringify(name ?? index)}
									{...{
										labelAlign: itemLabelAlign ?? labelAlign,
										col: itemCol ?? col,
										name,
										publicProps: {
											valueOtherData,
											value,
											valueData,
											setValue,
											publicProps
										},
										...columnAttrs
									}}
								/>
							)
						})}
					</Row>
				</Form>
			</Spin>
		</div>
	)
}

_Form = React.memo(_Form)
export default _Form as typeof _Form & {
	useFormData: typeof useFormData
	FormList: typeof FormList
	FormItem: typeof FormItem
	FormTable: typeof FormTable
	ShowText: typeof ShowText
	setFormNameToValue: typeof setFormNameToValue
	setSlotComponents: typeof setSlotComponents
}

const ShowText = props => {
	return <div>{props.value}</div>
}
// 大写是组件 小写是方法
// @ts-ignore
_Form.useFormData = useFormData
// @ts-ignore
_Form.FormList = FormList
// @ts-ignore
_Form.FormItem = FormItem
// @ts-ignore
_Form.FormTable = FormTable
// @ts-ignore
_Form.ShowText = ShowText
// @ts-ignore
_Form.setFormNameToValue = setFormNameToValue
// @ts-ignore
_Form.setSlotComponents = setSlotComponents
