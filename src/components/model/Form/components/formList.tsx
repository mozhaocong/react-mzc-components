import React from 'react'
import { Form } from 'antd'
import RForm from '../index'
import FormItem from './formItem'
import { getFormName } from '../uitls/tool'
import { _FormListType } from '../indexType'

const _FormList = (props: _FormListType) => {
	const { formName = '', columns = [], isForm = true, ...attrs } = props
	const config = {
		render: item => {
			const { publicProps = {}, value, valueData, setValue, valueOtherData } = item
			return (
				<Form.List name={formName}>
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index) => (
								<div key={'fields' + index}>
									{columns.map((res, index) => {
										const { name, ...resAttrs } = res
										return (
											<FormItem
												{...{
													...field,
													...resAttrs,
													key: JSON.stringify(getFormName(field.name, name)),
													name: getFormName(field.name, name),
													publicProps: {
														valueOtherData,
														value,
														valueData,
														setValue,
														publicProps,
														res,
														index,
														add,
														remove,
														field
													}
												}}
											/>
										)
									})}
								</div>
							))}
						</>
					)}
				</Form.List>
			)
		}
	}

	if (isForm) {
		return <RForm {...{ columns: [{ ...config }], ...attrs }} />
	} else {
		return config.render(attrs)
	}
}

export default _FormList
