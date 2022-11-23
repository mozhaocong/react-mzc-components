import { isTrue } from 'html-mzc-tool'
import React from 'react'
import { useEffect, useState } from 'react'

import { getScmEnums } from '@/api/scm/enums'

interface useApiDataType {
	params: ObjectMap
	isUpdate?: (parameters: any) => boolean
	isReset?: (parameters: any) => boolean
}
// @ts-expect-error
let apiRequest: (item: any) => Promise<any> = () => {
	return []
}
function setEnumsApiRequest(item) {
	apiRequest = item
}
setEnumsApiRequest(getScmEnums)

function setEnumsValue(item: ObjectMap = {}) {
	const data: ObjectMap = {}
	item?.data?.records.forEach(res => {
		data[res.enumName] = res.enumList || []
	})
	return data
}

export function useApiData(properties: useApiDataType): [any] {
	const { params, isUpdate, isReset } = properties
	const [parametersData, setParametersData] = useState<ObjectMap>({})
	const [value, setValue] = useState<ObjectMap>({})
	async function getApi(): Promise<void> {
		setParametersData(params)
		const data = await apiRequest(params)
		setParametersData(params)
		if (!isTrue(data)) {
			return setValue({})
		}
		setValue(setEnumsValue(data))
	}
	useEffect(() => {
		if (isReset?.(params)) {
			setParametersData({})
			if (!isTrue(value)) {
				return
			}
			setValue([])
			return
		}
		if (JSON.stringify(params) === JSON.stringify(parametersData)) return
		if (isUpdate && !isUpdate(params)) {
			return
		}
		void getApi()
	}, [apiRequest, params, isReset])
	return [value]
}

const View = () => {
	const [value] = useApiData({ params: { enumNameList: ['DeductType', 'SupplementOrderPurchaseType'] } })

	return (
		<div>
			<div>SelectApiParams</div>
			<div>{JSON.stringify(value)}</div>
		</div>
	)
}
export default React.memo(View)
