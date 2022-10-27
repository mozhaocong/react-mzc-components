import React, { forwardRef, useMemo } from 'react'
import { Select } from 'antd'
import { configBusinessDataOptions, configBusinessDataOptionsType } from './config'
import { SelectProps } from 'antd/lib/select'
import { isTrue } from 'html-mzc-tool'

interface propsType extends Omit<SelectProps, 'options'> {
	prop: keyof configBusinessDataOptionsType
	filter?: (item: ObjectMap[]) => ObjectMap[]
}

const View = forwardRef((props: propsType, ref) => {
	const { prop, filter, ...attrs } = props
	const options = useMemo(() => {
		let data = configBusinessDataOptions[prop] || []
		if (isTrue(filter)) {
			data = filter(data)
		}
		return data
	}, [prop])

	return (
		<Select
			// @ts-ignore
			ref={ref}
			{...{ style: { width: '100%' }, ...attrs, options: options }}
		/>
	)
})

export default React.memo(View)
