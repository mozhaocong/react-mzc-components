import { Select, Spin } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { arrayGetDataList, debounce, isTrue } from 'html-mzc-tool'
import React, { forwardRef, useEffect, useMemo, useState } from 'react'

type valueType = string | number

interface callBack {
	value: valueType
	label: valueType
	[index: string]: any
}
interface propertiesType extends Omit<SelectProps, 'options'> {
	apiRequest: (item: ObjectMap) => Promise<any>
	setParams: (searchData: string) => ObjectMap
	callBack: (item: ObjectMap) => callBack[]
	isReset?: (value: any) => boolean
}
// eslint-disable-next-line react/display-name
const View: React.FC<propertiesType> = forwardRef((properties: propertiesType, reference) => {
	const { apiRequest, setParams, callBack, isReset, ...attributes } = properties

	const [options, setOptions] = useState<callBack[]>([])

	const [loading, setLoading] = useState(false)

	const [isResetComponents, setIsResetComponents] = useState(true)

	const [changeOptions, setChangeOptions] = useState<ObjectMap>({})

	useEffect(() => {
		if (isReset?.(properties.value)) {
			if (!isTrue(options)) return
			setOptions([])
			resetComponents()
		}
	}, [isReset, properties.value])

	function onSearch(item: any): void {
		// setSearchData(item)
		if (isTrue(item)) {
			const prams = setParams(item)
			debounceGetApi(prams)
		}
	}

	function resetComponents(): void {
		setIsResetComponents(false)
		setTimeout(() => {
			setIsResetComponents(true)
		}, 10)
	}

	async function getApi(parameters: ObjectMap): Promise<void> {
		setLoading(true)
		const data = await apiRequest(parameters)
		setLoading(false)
		let optionsData = callBack(data) || []

		// mode特殊类型
		if (attributes?.mode === 'multiple') {
			const attributesValue = attributes.value || []
			const valueList = attributesValue.map((item: any) => {
				return { value: item }
			})
			const optionList = arrayGetDataList(options, valueList)
			const filterData: any[] = optionsData.filter(item => {
				return !attributesValue.includes(item.value)
			})
			optionsData = [...optionList, ...filterData]
		} else {
			// if (isTrue(attributes.value)) {
			//   const optionList: any = arrayGetData(options, {
			//     value: attributes.value,
			//   })
			//   const filterData = optionsData.filter((item) => {
			//     return item.value !== attributes.value
			//   })
			//   optionsData = [...optionList, ...filterData]
			// }
		}
		// if (!isTrue(optionsData) && properties.onChange && !isTrue(properties.value)) {
		//   properties.onChange(undefined, { value: undefined, label: undefined })
		// }
		setOptions(optionsData)
	}

	const debounceGetApi = useMemo(() => {
		return debounce(getApi, 300)
	}, [attributes.value])

	function onFocus(): void {
		if (!isTrue(attributes.value)) {
			setOptions([])
			return
		}
		if (attributes?.mode !== 'multiple' && isTrue(attributes.value) && !isTrue(options) && isTrue(changeOptions)) {
			// @ts-expect-error
			setOptions([{ ...changeOptions }])
		}
	}

	function onChange(event_: any, option: any): void {
		if (attributes.onChange) {
			attributes.onChange(event_, option)
		}
		setChangeOptions(option)
	}
	return (
		<Spin spinning={loading}>
			{isResetComponents && (
				<Select
					// @ts-expect-error
					ref={reference}
					{...{
						style: { width: '100%' },
						...attributes,
						showSearch: true,
						filterOption: false,
						onSearch,
						// onInputKeyDown,
						onFocus,
						onChange,
						showArrow: false,
						notFoundContent: null,
						// defaultActiveFirstOption: attributes?.mode !== 'multiple',
						options
					}}
				/>
			)}
		</Spin>
	)
})

export default React.memo(View)
