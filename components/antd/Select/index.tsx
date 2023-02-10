import { Select } from 'antd'
// eslint-disable-next-line import/named
import { SelectProps } from 'antd/es/select'
import { isTrue } from 'html-mzc-tool'
import { isNil } from 'ramda'
import React, { useMemo } from 'react'
const { Option } = Select

interface propertiesType {
	selectedList?: any[]
}
let View: React.FC<SelectProps & propertiesType> = properties => {
	const { options: propertyOptions = [], selectedList = [], ...attributes } = properties
	if (attributes.mode && attributes.mode === 'multiple' && isNil(attributes.value)) {
		attributes.value = []
	}
	const options = useMemo(() => {
		if (!isTrue(selectedList)) {
			return propertyOptions
		}
		return propertyOptions?.map(item => {
			if (selectedList.includes(item.value)) {
				return { ...item, disabled: true }
			}
			return item
		})
	}, [propertyOptions, selectedList])
	return (
		<Select
			showArrow={true}
			filterOption={(item, option) => {
				const { value = '', label = '' } = option || {}
				// @ts-expect-error
				return value.includes(item) || label.includes(item)
			}}
			showSearch={true}
			{...{ ...attributes, options }}
		/>
	)
}

View = React.memo(View)
export default View as typeof View & {
	Option: typeof Option
}
// @ts-ignore
View.Option = Option
