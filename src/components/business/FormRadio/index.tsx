import React, { forwardRef, useMemo } from 'react'
import { Radio } from 'antd'
import { configBusinessDataOptions, configBusinessDataOptionsType } from '../FormSelect/config'
import { RadioGroupProps } from 'antd/lib/radio/interface'
import { isTrue } from 'html-mzc-tool'

interface propsType extends RadioGroupProps {
	prop: keyof configBusinessDataOptionsType
}

const View = forwardRef((props: propsType, ref) => {
	const { prop, options: propsOptions, ...attrs } = props
	const options = useMemo(() => {
		if (isTrue(propsOptions)) {
			return propsOptions
		}
		return configBusinessDataOptions[prop] || []
	}, [prop, propsOptions])

	return (
		<Radio.Group
			// @ts-ignore
			ref={ref}
			{...{ style: { width: '100%' }, ...attrs }}
			options={options}
		/>
	)
})

export default React.memo(View)
