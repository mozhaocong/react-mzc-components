import { Form } from 'antd'
import React, { Fragment } from 'react'

import RForm from '../index'
import { _FormListType } from '../indexType'
import { getFormName } from '../uitls/tool'
import FormItem from './formItem'

const _FormList = (props: _FormListType) => {
	const { formName = '', columns = [], isForm = true, labelAlign = 'right', ...attrs } = props
	const config = {
		render: item => {
			const { publicProps = {}, value, valueData, setValue, valueOtherData } = item
			return (
				<Form.List name={formName}>
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index) => (
								<Fragment key={'fields' + index}>
									{columns.map((res, index) => {
										const { name, ...resAttrs } = res
										return (
											<FormItem
												{...{
													...field,
													...resAttrs,
													labelAlign,
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
								</Fragment>
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
