import React, { cloneElement } from 'react'
import { createRoot } from 'react-dom/client'

declare global {
	interface createElementProps {
		getContainer?: false
		createResolve?: (item?: any) => void
		createReject?: (item?: any) => void
	}
}

let uuid = 0
let dataList = []
export function createElement(item: React.ReactElement) {
	return new Promise((resolve, reject) => {
		const element = document.createElement('div')
		function createResolve(item?) {
			dataList = dataList.filter(filterItem => {
				const { id } = filterItem
				return element.id != id
			})
			element.remove()
			root.unmount()
			resolve(item ?? true)
		}

		function createReject(item) {
			dataList = dataList.filter(filterItem => {
				const { id } = filterItem
				return element.id != id
			})
			element.remove()
			root.unmount()
			reject(item ?? true)
		}

		uuid++
		element.id = 'create-element-' + uuid
		element.className = 'create-element'
		// 将指定的DOM类型的节点加到document.body的末尾
		document.body.appendChild(element)
		const list = cloneElement(item, {
			getContainer: false,
			createResolve,
			createReject
		})
		const root = createRoot(element)
		dataList.push({ id: element.id, element, root })
		root.render(list)
	})
}
export function closeAllElement() {
	dataList.forEach(forItem => {
		const { element, root } = forItem
		element.remove()
		root.unmount()
	})
	dataList = []
}
