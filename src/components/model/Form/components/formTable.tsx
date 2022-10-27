import React, { useEffect, useMemo, useState } from 'react'
import { isArray, isFunctionOfOther, isObject, isString, isTrue } from 'html-mzc-tool'
import FormItem from './formItem'
import { Table } from 'antd'
import { getFormName, getFormValueFromName } from '../uitls/tool'
import RForm from '../index'
import './formTable.less'
import { _FormTableType } from '../indexType'

const _FormTable = (props: _FormTableType) => {
	const { value, columns, formName, rowKey, isForm = true, ...attrs } = props
	const [data, setData] = useState([])
	const [formValue, setFormValue] = useState([])
	useEffect(() => {
		const formData = getFormValueFromName(value, formName)
		if (isArray(formData) && formValue.length !== formData.length) {
			setData(
				formData.map((item: any, index) => {
					item.key = isTrue(rowKey) ? isFunctionOfOther(rowKey, item) : index
					return item
				})
			)
		}
		setFormValue(formData)
	}, [value, formName])

	function setRulesTitle(title, rules) {
		if (!(isTrue(rules) && isString(title))) return title
		let isRequired = false
		if (isArray(rules)) {
			rules.forEach((item: any) => {
				if (item.required) {
					isRequired = true
				}
			})
		} else if (isObject(rules)) {
			isRequired = !!rules.required
		} else {
			return title
		}
		if (isRequired) {
			return (
				<span>
					<span style={{ color: 'red' }}>*</span>
					{title}
				</span>
			)
		} else {
			return title
		}
	}

	const tableColumns = useMemo(() => {
		const formValueData = getFormValueFromName(value, formName)
		const { valueData, setValue, publicProps, valueOtherData } = attrs
		return columns.map(item => {
			const { dataIndex, title, rules } = item
			if (isTrue(title)) {
				item.title = setRulesTitle(title, rules)
			}
			console.log('label', title, rules)
			if (isTrue(item.render)) {
				const oldRender = item.render
				// @ts-ignore
				item.render = (text, record, index) => {
					const renderProps = {
						text: isTrue(dataIndex) ? getFormValueFromName(formValueData[index], dataIndex) : formValueData[index],
						record: formValueData[index],
						index,
						item,
						value,
						valueData,
						valueOtherData,
						setValue,
						publicProps
					}

					if (!isTrue(dataIndex)) {
						return oldRender(renderProps) as any
					}
					return (
						<FormItem
							col={{ span: 24 }}
							labelCol={{ span: 0 }}
							wrapperCol={{ span: 24 }}
							component={() => oldRender(renderProps)}
							name={getFormName(formName, [index, dataIndex])}
							rules={item.rules}
						/>
					)
				}
			}
			return item
		})
	}, [columns])

	const config = {
		render() {
			return <Table columns={tableColumns} dataSource={data} pagination={false} />
		}
	}

	if (isForm) {
		return <RForm {...{ columns: [{ ...config }], value, ...attrs }} />
	} else {
		return config.render()
	}
}

export default _FormTable
