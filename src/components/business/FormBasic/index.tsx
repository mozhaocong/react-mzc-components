import React, { forwardRef, useEffect, useMemo } from 'react'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { useDispatch, useSelector } from 'react-redux'
import { isTrue } from 'html-mzc-tool'
import { businessProp, getBasicDataList } from '@/store/features/business'

interface propsType extends Omit<SelectProps, 'options'> {
	prop: keyof typeof businessProp
	filter?: (item: ObjectMap[]) => ObjectMap[]
}

const View = forwardRef((props: propsType, ref) => {
	const { prop, filter, ...attrs } = props
	const dispatch = useDispatch()
	const state = useSelector((state: any) => state)
	const options = useMemo(() => {
		let data = state.business[prop]
		if (isTrue(filter)) {
			data = filter(data)
		}
		return data
	}, [state.business[prop]])

	useEffect(() => {
		if (!isTrue(state.business[prop])) {
			dispatch(getBasicDataList({ type: prop }))
		}
	}, [])
	return (
		<Select
			// @ts-ignore
			ref={ref}
			{...{ style: { width: '100%' }, ...attrs, options: options }}
		/>
	)
})

export default React.memo(View)
