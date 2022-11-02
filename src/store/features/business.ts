import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosGet, isTrue, throttle } from 'html-mzc-tool'
import { has, map } from 'ramda'

export function getSysUserList(data: ObjectMap, options?: ObjectMap) {
	return axiosGet('http://erp_test.admin.htwig.com' + '/api/users', data, options)
}

const throttleObject: ObjectMap = {
	getBasicSysUserListThrottle: throttle(getSysUserList)
}

function getStoreConfig(type: string, that: any): ObjectMap {
	if (has(type + 'Config', that)) {
		return that[type + 'Config'] as any
	} else {
		return {}
	}
}

export const getBasicDataList = createAsyncThunk('business/getBasicDataList', async (item: any = {}, thunkAPI) => {
	// @ts-ignore
	const { business } = thunkAPI.getState()
	const state: any = business
	const { type, params = {} } = item
	const throttleName = 'get' + type.slice(0, 1).toUpperCase() + type.slice(1) + 'Throttle'
	const config = state[type + 'Config'] || {}
	const defParam = config.params?.[0] || {}
	if (has(throttleName, throttleObject)) {
		// @ts-ignore
		const res = await throttleObject[throttleName]({
			size: 999,
			current: 1,
			...defParam,
			...params
		})
		if (!isTrue(res)) {
			return
		}
		const typeMap = getStoreConfig(type, state)
		let returnData = res?.data?.result
		if (isTrue(typeMap.data)) {
			let forData = res
			try {
				typeMap.data.forEach((forRes: any) => {
					forData = forData[forRes]
				})
				returnData = forData
			} catch (e) {
				console.warn('getBasicDataList 配置报错', typeMap)
			}
		}
		thunkAPI.dispatch(businessSlice.actions.setBasicDataList({ type, data: returnData }))
	} else {
		console.error('basicData找不到' + type + '对应的接口')
		return
	}
}) as (item: { type: any }) => any

export const businessProp = {
	basicSysUserList: [] //系统用户
}

export const businessSlice = createSlice({
	name: 'business',
	// 初始值
	initialState: {
		...businessProp,
		basicSysUserListConfig: {
			value: 'id',
			label: 'real_name',
			data: ['data', 'items']
		}
	},
	// 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
	reducers: {
		setBasicDataList(state: ObjectMap, { payload }) {
			const { type, data = [] } = payload
			state[type] = map(res => {
				const label = has(type + 'Config', state)
					? (state[type + 'Config'] as ObjectMap).label
						? res[(state[type + 'Config'] as ObjectMap).label]
						: res.real_name
					: res.label
				const value = has(type + 'Config', state)
					? (state[type + 'Config'] as ObjectMap).value
						? res[(state[type + 'Config'] as ObjectMap).value]
						: res.value
					: res.value
				return {
					label: label,
					value: value,
					...res
				}
			}, data)
		}
	}
})
// 导出actions

export default businessSlice.reducer
