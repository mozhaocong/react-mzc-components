import './index.less'

import { Form, Row, Spin } from 'antd'
import { diffFormData, isTrue } from 'html-mzc-tool'
import React, { useEffect, useMemo, useRef } from 'react'

import FormItem from './components/formItem'
import FormList from './components/formList'
import FormTable from './components/formTable'
import { _FormType } from './indexType'
import { setSlotComponents, useFormData } from './uitls'
import { formDataToParameters, getFormValueFromName, setFormExtraData, setFormNameToValue } from './uitls/tool'

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
		fields,
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
		if (isTrue(fields)) return
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
					{...{ labelCol, wrapperCol, ...attrs, fields }}
					form={form}
					id={fId || 'fromID'}
					onFinish={onFinish}
					autoComplete='off'
					onValuesChange={() => {
						if (isTrue(fields)) return
						if (onChange) {
							onChange(diffFormData(form.getFieldsValue(), value))
							// onChange(form.getFieldsValue())
						}
					}}
					onFieldsChange={(_, allFields) => {
						if (isTrue(fields)) {
							if (onChange) {
								onChange(allFields)
							}
						}
					}}>
					<Row className={'form-row'} style={{ margin: 0 }}>
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
	getFormValueFromName: typeof getFormValueFromName
	setFormExtraData: typeof setFormExtraData
	formDataToParameters: typeof formDataToParameters
	ShowAmount: typeof ShowAmount
}

const ShowText = props => {
	const { value, ...attrs } = props
	return <div {...{ style: { overflow: 'hidden', wordBreak: 'break-all' }, ...attrs }}>{value || '-'}</div>
}

const ShowAmount = props => {
	const { value, ...attrs } = props
	const showData = useMemo(() => {
		if (!isTrue(value)) return '-'
		try {
			return value?.toFixed(2) || '0.00'
		} catch (e) {
			return '0.00'
		}
	}, [value])
	return <div {...attrs}>{showData || '-'}</div>
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
_Form.ShowAmount = ShowAmount
// @ts-ignore
_Form.setFormNameToValue = setFormNameToValue
// @ts-ignore
_Form.setSlotComponents = setSlotComponents
// @ts-ignore
_Form.getFormValueFromName = getFormValueFromName
// @ts-ignore
_Form.setFormExtraData = setFormExtraData
// @ts-ignore
_Form.formDataToParameters = formDataToParameters
