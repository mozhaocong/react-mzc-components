import React from 'react'
import { Outlet } from 'react-router-dom'

import style from './index.module.less'

const Home = () => {
	return (
		<div className={style.layout}>
			<Outlet />
		</div>
	)
}

export default Home
