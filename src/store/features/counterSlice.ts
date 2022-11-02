import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const testMethod = () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(1)
		}, 1000)
	})
}

export const asyncIncrement = createAsyncThunk('counter/getActivityList', async (params: any = {}, thunkAPI) => {
	console.log(params)
	console.log(thunkAPI.getState())
	const data = await testMethod()
	console.log('data', data)
	thunkAPI.dispatch(counterSlice.actions.increment({ step: 2 }))
}) as (item: ObjectMap) => any

export const counterSlice = createSlice({
	name: 'counter', // 命名空间，在调用action的时候会默认的设置为action的前缀
	// 初始值
	initialState: {
		count: 1,
		title: 'redux toolkit pre'
	},
	// 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
	reducers: {
		increment(state, { payload }) {
			console.log(state)
			// console.log(action);
			state.count = state.count + payload.step // 内置了immutable
		},
		decrement(state) {
			console.log(state)
			state.count -= 1
		}
	}
	// extraReducers: {
	//   [getActivityList.fulfilled.type]: (state, action) => {
	//     console.log(action)
	//     state.count += 1
	//   }
	// }
})
// 导出actions
export const { increment, decrement } = counterSlice.actions

export default counterSlice.reducer
