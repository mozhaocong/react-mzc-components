import { Modal } from '@components/index'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
const { createSetReact, CreteSetReactDom } = Modal
const View = () => {
	const [value, setValue] = useState([])

	return (
		<div>
			<CreteSetReactDom />
			<Button
				onClick={() => {
					createSetReact(<div>{new Date().getTime()}</div>)
				}}>
				测试
			</Button>
		</div>
	)
}

export default View
