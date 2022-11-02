import { deepClone, isObject, isTrue } from 'html-mzc-tool'

export function requestJudgment(item: ObjectMap): boolean {
	return [200].includes(item.state)
}

export function scrollbarsTop(dom: any = document.querySelector('#ht_admin_children')) {
	if (!dom) return
	dom.scrollTop = 0
}

export function defFunction(item = null) {
	return item
}

export async function editApiRequest(item: { api: () => Promise<any>; setMethod: (item: boolean) => void; callBack: () => void }) {
	const { setMethod = defFunction, api, callBack = defFunction } = item
	setMethod(true)
	const res = await api()
	setMethod(false)
	callBack()
	if (requestJudgment(res)) {
		return Promise.resolve(res)
	} else {
		return Promise.reject()
	}
}

export function objectRecursiveMerge(dataSource: ObjectMap = {}, mergeData: ObjectMap = {}) {
	const data = deepClone(dataSource)
	function mergeDataFor(item: any = {}) {
		const { target, mergeData, pTarget = {}, pMergeData = {}, key = '' } = item
		if (!isTrue(target)) {
			pTarget[key] = pMergeData[key]
			return
		}
		if (isObject(target) && isTrue(target) && isObject(mergeData) && isTrue(mergeData)) {
			for (const itemKey in mergeData) {
				mergeDataFor({
					target: target[itemKey],
					mergeData: mergeData[itemKey],
					pTarget: target,
					pMergeData: mergeData,
					key: itemKey
				})
			}
		} else {
			pTarget[key] = mergeData
			return
		}
	}
	mergeDataFor({ target: data, mergeData })
	return data
}

export function arrayToObject(
	dataSource: ObjectMap = {},
	arrayData: Array<string | number> = [],
	setData?: (returnData: any) => string | number | null | undefined
) {
	const data = deepClone(dataSource)
	let replaceData = data
	let itemData: ObjectMap = {}
	let key: any = ''
	try {
		for (const item of arrayData) {
			itemData = replaceData
			if (!isTrue(replaceData[item])) {
				replaceData[item] = {}
			}
			replaceData = replaceData[item]
			key = item
		}
	} catch (e) {
		console.error(e, '数组转对象，数据源与数组类型不匹配', 'dataSource', dataSource, 'arrayData', arrayData)
		return {}
	}

	if (!setData) {
		return deepClone(dataSource)
	}
	const returnData = setData(deepClone(itemData[key]))
	itemData[key] = returnData
	return data
}

export function getArrayToObjectTargetValue(dataSource: ObjectMap = {}, arrayData: Array<string | number> = []) {
	let data = ''
	arrayToObject(dataSource, arrayData, value => {
		data = value
		return 1
	})
	return data
}

// 和getArrayToObjectTargetValue 一样作用， 就是一个是for 一个是reduce
export function getArrayReduceObject(dataSource: ObjectMap = {}, arrayData: Array<string | number> = []) {
	const data = deepClone(dataSource)
	let array = deepClone(arrayData)
	array = [data, ...array]
	try {
		return array.reduce((total: any, num: any) => {
			return total[num] || {}
		})
	} catch (e) {
		console.error(e, '数组转对象，数据源与数组类型不匹配', 'dataSource', dataSource, 'arrayData', arrayData)
	}
}

export function mockDataSource(item: any[], nubData = 10): any[] {
	const data = item.map(res => {
		return { key: res.dataIndex ?? res.key }
	})
	let nub = 0
	return [...Array(nubData)].map(() => {
		const returnData: any = { id: nub }
		nub++
		data.forEach(item => {
			returnData[item.key] = nub
			nub++
		})
		return returnData
	})
}
