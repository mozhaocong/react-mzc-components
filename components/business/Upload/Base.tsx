import { Upload } from 'antd'
import type { UploadProps } from 'antd/es/upload/interface'
import { deepClone, isTrue } from 'html-mzc-tool'
import React, { forwardRef, useMemo, useState } from 'react'

import axiosPost from './axios'
import { getImageWidthHeight } from './utils'

type valueType = Array<{ fileUrl: string; fileCode: string; fileName: string }>
interface dataType {
	value: valueType
	onChange: (item: any) => void
	bssApi: (item: { originalFileName: string }) => Promise<ObjectMap>
	onRemove?: (file: ObjectMap, fileList: any[]) => void
}

type propertiesType = dataType & Omit<UploadProps, 'onRemove'>
let uuid = Date.now()

// eslint-disable-next-line react/display-name
const View = forwardRef((properties: propertiesType, reference) => {
	const { value, onChange, bssApi, onRemove, children, ...attributes } = properties
	const [loadingList, setLoadingList] = useState<any[]>([])
	const fileList: any[] = useMemo(() => {
		return (
			value?.map(item => {
				uuid++
				const { fileUrl, fileName } = item
				return {
					uid: uuid.toString(),
					name: fileName,
					status: 'done',
					url: fileUrl
				}
			}) || []
		)
	}, [value])

	async function getApiData(item: any): Promise<ObjectMap> {
		const { name = '', file, uuid, ...attributes_ } = item
		// 获取oss参数外面传进来 bssApi
		const result = await bssApi({ originalFileName: name, ...attributes_ })
		if (!isTrue(result)) return { state: false }
		// 添加正在加载的列表
		setLoadingList([...loadingList, { uuid, fileName: name }])
		const { fields, uploadUrl, fileUrl, fileCode }: any = result
		let parameters: ObjectMap = {}
		for (const fieldItem of fields) {
			parameters[fieldItem.key] = fieldItem.value
		}
		parameters = { ...parameters, file }
		const postData = await axiosPost(uploadUrl, parameters, { headers: { 'Content-Type': 'multipart/form-data' } })
		const filterList = loadingList.filter((response: any) => {
			return uuid !== response.uuid
		})
		setLoadingList(filterList)
		return postData?.status === 200 ? { state: true, fileUrl, fileCode } : { state: false }
	}

	function setValueData({ fileUrl, fileCode, fileName }: any): void {
		const data = deepClone(value)
		data.push({ fileUrl, fileCode, fileName })
		onChange(data)
	}

	const uploadProperties: UploadProps = {
		onRemove: file => {
			if (onRemove) {
				onRemove(file, fileList)
				return
			}
			const index = fileList.indexOf(file)
			const data = [...value]
			data.splice(index, 1)
			onChange(data)
		},
		beforeUpload: async (file: any) => {
			let parameters = {}
			if (file.type.includes('image/')) {
				const { width, height } = await getImageWidthHeight(file)
				parameters = { picHeight: height, picWidth: width }
			}
			uuid++
			const result = await getApiData({ name: file?.name, file, uuid, ...parameters })
			const { state, fileUrl, fileCode } = result
			if (state) {
				setValueData({ fileUrl, fileCode, fileName: file.name })
			}
			return false
		},
		fileList
	}

	return (
		// @ts-expect-error
		<div ref={reference}>
			{loadingList.map((item: any) => {
				return item.fileName
			})}
			<Upload {...{ ...attributes, ...uploadProperties }}>{children}</Upload>
		</div>
	)
})

export default React.memo(View)
