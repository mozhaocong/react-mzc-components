import { isTrue } from 'html-mzc-tool'

export { dataMomentToTimeData } from './data'

export function judgmentApiSuccess(item: ObjectMap): boolean {
	return item.code === 'SUCCESS'
}
// 判断对象是否存在空值
export function objectExistNull(item: ObjectMap): boolean {
	for (const itemKey in item) {
		if (!isTrue(item[itemKey])) {
			return true
		}
	}
	return false
}
