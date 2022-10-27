import { cloneElement } from 'react'
import { createRoot } from 'react-dom/client'

declare global {
	interface createElementProps {
		getContainer?: false
		createResolve?: (item?: any) => void
		createReject?: (item?: any) => void
	}
}

let uuid = 0
export function createElement(item: any) {
	return new Promise((resolve, reject) => {
		const element = document.createElement('div')
		function createResolve(item?) {
			element.remove()
			root.unmount()
			resolve(item ?? true)
		}

		function createReject(item) {
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
		root.render(list)
	})
}
