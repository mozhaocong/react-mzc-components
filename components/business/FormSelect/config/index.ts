import { forEach, keys } from 'ramda'

import { purchaseObject } from './purchase'
import { settleCenterObject, settleCenterStatusKey, settleCenterStatusLabel } from './settleCenter'
export type { settleCenterStatusKey, settleCenterStatusLabel }

type businessOptObjectType = typeof businessOptObject
export type configBusinessDataOptionsType = {
	[T in keyof businessOptObjectType]: any[]
}
export const businessOptObject = {
	...settleCenterObject,
	...purchaseObject,
	baseYesNo: {
		1: '是',
		0: '否'
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
	const _object = {}
	forEach((key: any) => {
		const list: any[] = []
		const item = data[key]
		forEach((key: any) => {
			const a = Number(key)
			list.push({
				value: isNaN(a) ? key : a,
				label: item[key]
			})
		}, keys(item))
		_object[key] = list
	}, keys(data))
	return _object
}

export const configBusinessDataOptions: configBusinessDataOptionsType = getOptions(businessOptObject) as configBusinessDataOptionsType
