import { isTrue } from 'html-mzc-tool'
import { useEffect, useState } from 'react'

function deferFunction(item?: any): void {
	return item
}
let judgmentApiSuccess = (item: ObjectMap): boolean => {
	// return !!item
	return true
}

export function setJudgmentApiSuccess(item: (item: ObjectMap) => boolean) {
	judgmentApiSuccess = item
}

async function editApiRequest(item: {
	api: () => Promise<any>
	setMethod?: (item: boolean) => void
	callBack?: (isSuccess: boolean) => void
}): Promise<any> {
	const { setMethod = deferFunction, api, callBack = deferFunction } = item
	setMethod(true)
	const response = await api()
	setMethod(false)
	callBack(judgmentApiSuccess(response))
	return await new Promise((resolve, reject) => {
		if (judgmentApiSuccess(response)) {
			resolve(response)
		} else {
			reject(response)
		}
	})
}

interface useApiDataType {
	apiRequest: (item: ObjectMap) => Promise<any>
	params: ObjectMap
	isUpdate?: (parameters: any) => boolean
	isReset?: (parameters: any) => boolean
}

export function useApiData(properties: useApiDataType): [any] {
	const { apiRequest, params, isUpdate, isReset } = properties
	const [parametersData, setParametersData] = useState<ObjectMap>({})
	const [value, setValue] = useState<any[]>([])
	async function getApi(): Promise<void> {
		setParametersData(params)
		const data = await editApiRequest({
			api: () => apiRequest(params),
			callBack: () => {
				setParametersData({})
			}
		})
		setParametersData(params)
		setValue(data)
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
