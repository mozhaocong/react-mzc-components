import { arrayToObject, deepClone, getArrayToObjectTargetValue, isArray, isObject, isString, isTrue } from 'html-mzc-tool'

// 获取form name  fieldName:上级name，name:当前name
export const getFormName = (fieldName, name) => {
	let data = [fieldName]
	if (isArray(fieldName)) {
		data = fieldName
	}
	if (isArray(name)) {
		data = [...data, ...name]
	} else {
		data.push(name)
	}
	return data
}

// 获取 Form value 的name， name 是数组或者字符
export function getFormValueFromName(value: ObjectMap, item: Array<string | number> | string | number): any {
	if (!(isTrue(value) && isTrue(item))) {
		return ''
	}
	if (isArray(item)) {
		return getArrayToObjectTargetValue(value, item)
	} else {
		return deepClone(value[item as string])
	}
}

// 设置 form value 的值
export function setFormNameToValue(
	value: ObjectMap,
	setData: string | number | Array<string | number>,
	setMethod: (item: any) => string | number | null | undefined | any[]
) {
	if (isArray(setData)) {
		return arrayToObject(value, setData, setMethod)
	} else if (isString(setData)) {
		const data = deepClone(value)
		data[setData] = setMethod(deepClone(data[setData]))
		return data
	} else {
		return value
	}
}

// const formData = { a: 1 }
// const extraData = { value: { 1: '2' } }
// const mapData = [{ targetKey: 'a', paramsKey: 'b' }]
// const logData = formDataToParameters({ formData, extraData, mapData })
// console.log(logData)

// const formData = { a: 1 }
// const extraData = { value: { test: { 1: 2 } } }
// const mapData = [{ targetKey: 'a', paramsKey: 'b', extraKey: ['test'] }]
// const logData = formDataToParameters({ formData, extraData, mapData })
// console.log(logData)
interface formDataToParametersType {
	formData: ObjectMap
	extraData: { value: ObjectMap }
	mapData: Array<{ targetKey: string; paramsKey: string; extraKey?: Array<string | number> }>
}
export function formDataToParameters(item: formDataToParametersType): ObjectMap {
	const { mapData, extraData } = item
	let { formData } = item
	formData = deepClone(formData)
	for (const mapItem of mapData) {
		const { targetKey, paramsKey, extraKey } = mapItem
		const formDataKeyData = formData[targetKey]
		if (isTrue(formDataKeyData)) {
			let data = extraData.value
			if (isTrue(extraKey)) {
				data = getArrayToObjectTargetValue(extraData.value, extraKey)
			}
			if (isObject(data) && isTrue(data[formDataKeyData])) {
				formData[paramsKey] = data[formDataKeyData]
			}
		}
	}
	return formData
}

// const formData = { a: 1, b: '2' }
// const extraData = { value: {} }
// const mapData = [{ targetKey: 'a', paramsKey: 'b' }]
// const logData = setFormExtraData({ formData, extraData, mapData })
// console.log(logData)

// const formData = { a: 1, b: 1 }
// const extraData = { value: {} }
// const mapData = [{ targetKey: 'a', paramsKey: 'b', extraKey: ['test'] }]
// const logData = setFormExtraData({ formData, extraData, mapData })
// console.log(logData)
export interface setFormExtraDataType {
	formData: ObjectMap
	extraData: { value: ObjectMap }
	mapData: Array<{ targetKey: string; paramsKey: string; extraKey?: Array<string | number> }>
}
export function setFormExtraData(item: setFormExtraDataType): ObjectMap {
	const { formData, mapData, extraData } = item
	for (const mapItem of mapData) {
		const { targetKey, paramsKey, extraKey } = mapItem
		if (isTrue(formData[targetKey]) && isTrue(formData[paramsKey])) {
			if (isTrue(extraKey)) {
				extraData.value = arrayToObject(extraData.value, extraKey, item => {
					if (!isTrue(item)) {
						item = {}
					}
					item[formData[targetKey]] = formData[paramsKey]
					return item
				})
			} else {
				extraData.value[formData[targetKey]] = formData[paramsKey]
			}
		}
	}
	return extraData
}
