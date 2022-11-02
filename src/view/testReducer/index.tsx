import { Button } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { asyncIncrement, decrement, increment } from '@/store/features/counterSlice'
const View = () => {
	const { count } = useSelector((state: any) => state?.counter)
	const dispatch = useDispatch()
	return (
		<div>
			<div>{count}</div>
			<Button onClick={() => dispatch(decrement())}>decrement</Button>
			<Button onClick={() => dispatch(increment({ step: 2 }))}>increment</Button>
			<Button onClick={() => dispatch(asyncIncrement({}))}>increment</Button>
		</div>
	)
}
export default View
