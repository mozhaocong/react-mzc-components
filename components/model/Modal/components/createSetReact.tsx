import React, { cloneElement, useEffect, useState } from 'react'

declare global {
	interface createElementProps {
		getContainer?: false
		createResolve?: (item?: any) => void
		createReject?: (item?: any) => void
	}
}

let reactSetValue = null
let reactValue = null

export function setReactCreateValue(value, setValue) {
	reactValue = value
	reactSetValue = setValue
}

let uuid = 0
let dataList = []
export function createSetReact(item: React.ReactElement) {
	if (!reactSetValue) return
	return new Promise((resolve, reject) => {
		const element: any = {}
		function createResolve(item?) {
			dataList = dataList.filter(filterItem => {
				const { id } = filterItem
				return element.id != id
			})
			const data = reactValue.filter(filterItem => {
				const { id } = filterItem
				return element.id != id
			})
			reactSetValue(data)
			resolve(item ?? true)
		}

		function createReject(item) {
			dataList = dataList.filter(filterItem => {
				const { id } = filterItem
				return element.id != id
			})
			const data = reactValue.filter(filterItem => {
				const { id } = filterItem
				return element.id != id
			})
			reactSetValue(data)
			reject(item ?? true)
		}

		uuid++
		element.id = 'create-element-' + uuid
		const list = cloneElement(item, {
			getContainer: false,
			createResolve,
			createReject
		})

		const data = reactValue
		reactSetValue([...data, { id: element.id, dom: list }])
		dataList.push({ id: element.id })
	})
}

export const CreteSetReactDom = () => {
	const [value, setValue] = useState([])
	useEffect(() => {
		setReactCreateValue(value, setValue)
	}, [value])
	return (
		<>
			{value.map((mapItem, index) => {
				const { dom } = mapItem
				return dom
			})}
		</>
	)
}
export function closeAllElement() {
	dataList.forEach(forItem => {
		// const { element, root } = forItem
		// element.remove()
		// root?.unmount()
	})
	dataList = []
}
