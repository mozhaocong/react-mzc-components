// @ts-ignore
import { Button, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { isTrue } from 'html-mzc-tool'
import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'

import routes, { mapRouter } from '@/routes'

export function Interceptor(pros) {
	const { route } = pros
	console.log('route', route)
	const RenderCom = route.component
	return <RenderCom route={route} />
}

const RouterButton = () => {
	const navigate = useNavigate()
	const data = []
	for (const mapKey in mapRouter) {
		data.push({ title: mapKey })
	}
	return (
		<div>
			{data.map((item, index) => {
				return (
					<Button
						key={index}
						onClick={() => {
							navigate(item.title)
						}}>
						{item.title}
					</Button>
				)
			})}
		</div>
	)
}

const App = () => {
	function setRouter() {
		return routes.map((item: any, index: any) => {
			return (
				<Route key={index} path={item.path} element={<Interceptor route={item} />}>
					{isTrue(item.children) &&
						item.children.map((res: any, childIndex: number) => {
							return <Route path={res.path} key={childIndex} element={<Interceptor route={res} />} />
						})}
				</Route>
			)
		})
	}

	return (
		<ConfigProvider locale={zhCN}>
			<BrowserRouter>
				<RouterButton />
				<Suspense>
					<Routes>{setRouter()}</Routes>
				</Suspense>
			</BrowserRouter>
		</ConfigProvider>
	)
}

export default App
