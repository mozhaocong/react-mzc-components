import { Select, Spin } from '@components/antd'
import { SelectProps } from 'antd/lib/select'
import { arrayGetDataList, isTrue } from 'html-mzc-tool'
import React, { forwardRef, useEffect, useState } from 'react'

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

	const [searchData, setSearchData] = useState('')

	const [loading, setLoading] = useState(false)

	const [isResetComponents, setIsResetComponents] = useState(true)

	useEffect(() => {
		if (isReset?.(properties.value)) {
			if (!isTrue(options)) return
			setOptions([])
			resetComponents()
		}
	}, [isReset, properties.value])

	function onSearch(item: any): void {
		setSearchData(item)
	}

	function resetComponents(): void {
		setIsResetComponents(false)
		setSearchData('')
		setTimeout(() => {
			setIsResetComponents(true)
		}, 10)
	}

	async function onInputKeyDown(event: any): Promise<void> {
		if (event.keyCode === 13) {
			setLoading(true)
			const prams = setParams(searchData)
			await getApi(prams)
			setLoading(false)
		}
	}

	async function getApi(parameters: ObjectMap): Promise<void> {
		const data = await apiRequest(parameters)
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
		}
		// 重置数据
		if (!isTrue(optionsData) && properties.onChange) {
			if (isTrue(properties.value)) {
				properties.onChange(undefined, { value: undefined, label: undefined })
			}
			resetComponents()
		}
		setOptions(optionsData)
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
						onInputKeyDown,
						showArrow: false,
						notFoundContent: null,
						defaultActiveFirstOption: attributes?.mode !== 'multiple',
						options
					}}
				/>
			)}
		</Spin>
	)
})

export default React.memo(View)
