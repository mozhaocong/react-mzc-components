import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import type { UploadProps } from 'antd/es/upload/interface'
import { isTrue } from 'html-mzc-tool'
import { axiosPost as request } from 'html-mzc-tool'
import { isEqual } from 'lodash'
import React, { forwardRef, useEffect, useRef, useState } from 'react'

import BaseUpload from './Base'

const url = 'http://supply-gateway-dev.htwig.com/bss/file/getFileUploadProperties'

const listFileByCode = 'http://supply-gateway-dev.htwig.com/bss/file/listFileByCode'

type valueType = string[]
interface dataType {
	value?: valueType
	onChange?: (item: any) => void
	bizType: string
	onRemove?: (file: ObjectMap, fileList: any[]) => void
}

type propertiesType = dataType & Omit<UploadProps, 'onChange' | 'defaultFileList' | 'fileList' | 'onRemove'>
// eslint-disable-next-line react/display-name
const View = forwardRef((properties: propertiesType, reference) => {
	const { bizType, value = [], onChange, ...attributes } = properties

	const apiList = useRef<any[]>([])
	const [valueApiObject, setValueApiObject] = useState<ObjectMap>({})
	const [uploadValue, setUploadValue] = useState<any[]>([])

	async function getListFileByCode(item: any[]): Promise<any> {
		apiList.current = [...apiList.current, ...item]
		const result = await request(listFileByCode, { fileCodeList: item })
		const data: ObjectMap = {}
		result?.list?.forEach((response: any) => {
			data[response.fileCode] = response
		})
		setValueApiObject({ ...valueApiObject, ...data })
	}

	useEffect(() => {
		apiList.current = apiList.current.filter(item => {
			return !valueApiObject[item]
		})
		if (!isTrue(value)) return
		const valueData: any[] = []
		for (const item of value) {
			if (valueApiObject[item]) {
				valueData.push(valueApiObject[item])
			}
		}

		if (!isEqual(valueData, uploadValue)) {
			setUploadValue(valueData)
		}
	}, [value, valueApiObject])

	useEffect(() => {
		const list = []
		if (!isTrue(value)) return
		for (const item of value) {
			if (!(valueApiObject[item] || apiList.current.includes(item))) {
				list.push(item)
			}
		}
		if (!isTrue(list)) return
		void getListFileByCode(list)
	}, [value])

	function uploadChange(item: any): void {
		const data: ObjectMap = {}
		const returnValue = []
		for (const response of item) {
			if (!valueApiObject[response.fileCode]) {
				data[response.fileCode] = response
			}
			returnValue.push(response.fileCode)
		}
		setValueApiObject({ ...valueApiObject, ...data })
		onChange?.(returnValue)
	}
	async function bssApi(item: any): Promise<any> {
		return await request(
			url,
			{
				bizType,
				...item
			},
			{
				headers: {
					Authorization: 1
				}
			}
		)
	}

	return (
		<BaseUpload ref={reference} {...{ listType: 'picture-card', ...attributes, bssApi, value: uploadValue, onChange: uploadChange }}>
			<Button icon={<UploadOutlined />}>Select</Button>
		</BaseUpload>
	)
})

export default React.memo(View)
