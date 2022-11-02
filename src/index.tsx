import 'antd/dist/antd.css'
import 'moment/locale/zh-cn'

import { axiosInit, isTrue } from 'html-mzc-tool'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import store from '@/store/index'

import App from './App'

axiosInit({
	setConfigHeaders() {
		const data = localStorage.getItem('Authorization')
		return isTrue(data) ? { Authorization: data } : {}
	}
})

function appInit() {
	// axiosInit()
	// ReactDOM.render(<App />, document.getElementById('app'))
	ReactDOM.createRoot(document.getElementById('app')).render(
		<Provider store={store}>
			<App />
		</Provider>
	)
}

appInit()
