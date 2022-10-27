import { forEach, keys } from 'ramda'

type businessOptObjectType = typeof businessOptObject
export type configBusinessDataOptionsType = {
	[T in keyof businessOptObjectType]: any[]
}
export const businessOptObject = {
	supplierSplitType: {
		1: '大货采购',
		2: '加工采购'
	},
	supplierOfferType: {
		1: '我方提供原料',
		2: '不提供原料'
	},
	baseStatus: {
		0: '禁用',
		1: '启用'
	},
	baseEffective: {
		0: '有效',
		1: '失效'
	}
}

function getOptions(data: any): any {
	const _obj = {}
	forEach(key => {
		const list = []
		const item = data[key]
		forEach(key => {
			const a = Number(key)
			list.push({
				value: isNaN(a) ? key : a,
				label: item[key]
			})
		}, keys(item))
		_obj[key] = list
	}, keys(data))
	return _obj
}

export const configBusinessDataOptions: configBusinessDataOptionsType = getOptions(businessOptObject) as configBusinessDataOptionsType
