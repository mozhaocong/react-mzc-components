import { configureStore } from '@reduxjs/toolkit'

import businessSlice from '@/store/features/business'

import counterSlice from './features/counterSlice'

export default configureStore({
	reducer: {
		counter: counterSlice,
		business: businessSlice
	}
})
