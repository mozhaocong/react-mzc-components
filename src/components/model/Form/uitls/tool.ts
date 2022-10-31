import { deepClone, isArray, isString, isTrue, arrayToObject, getArrayToObjectTargetValue } from 'html-mzc-tool'

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
export function getFormValueFromName(value: ObjectMap, item: Array<string | number> | string | number) {
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
	setMethod: (item: any) => string | number | null | undefined
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
