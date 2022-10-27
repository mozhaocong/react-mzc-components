import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { ModalFuncProps, ModalProps } from 'antd/lib/modal/Modal'
import { isTrue } from 'html-mzc-tool'
import { createElement } from './components/createElement'

type createModal = {
	destroy: () => void
	destroyAll: () => void
	update: (item: ObjectMap) => ObjectMap | ObjectMap
}

let uuId = 0
export function createModal(config?: ModalFuncProps): createModal {
	const { type, ...attrs } = config
	uuId++
	let icon
	let modalType = type
	if (!isTrue(type)) {
		icon = null
		modalType = 'success'
	}

	let wrapClassName = `model-drag-${uuId}`
	if (isTrue(config.wrapClassName)) {
		wrapClassName = config.wrapClassName + ' ' + wrapClassName
	}
	const modal = Modal[modalType]({
		icon,
		...attrs,
		wrapClassName
	})
	setTimeout(() => {
		drag(document.querySelector(`.model-drag-${uuId}`))
	}, 10)
	return modal as any
}

function drag(item: any, res?) {
	dragMethod(item?.querySelector('.ant-modal-content'), res)
}

function dragMethod(dragDom, item?: () => boolean) {
	if (!isTrue(dragDom)) return
	// const dragDom = document.getElementById('drag')
	// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
	// @ts-ignore
	const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
	// 鼠标在移动盒子上按下
	dragDom.onmousedown = function (e) {
		if (isTrue(item) && !item()) return
		// console.log('鼠标按下事件')
		dragDom.style.cursor = 'move'

		// 鼠标按下，计算当前元素距离可视区的距离
		const disX = e.clientX
		const disY = e.clientY

		// 获取到的值带px 正则匹配替换
		let styL = null
		let styT = null

		// 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
		if (sty.left.includes('%')) {
			styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
			styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
		} else {
			// @ts-ignore
			styL = +sty.left.replace(/\px/g, '')
			// @ts-ignore
			styT = +sty.top.replace(/\px/g, '')
		}

		document.onmousemove = function (e) {
			e.preventDefault() // 移动时禁用默认事件

			// 通过事件委托，计算移动的距离
			const l = e.clientX - disX
			const t = e.clientY - disY

			// 移动当前元素
			dragDom.style.left = `${l + styL}px`
			dragDom.style.top = `${t + styT}px`
		}

		document.onmouseup = mouseUp
	}

	// 鼠标抬起
	function mouseUp() {
		// console.log('鼠标抬起事件')
		dragDom.style.cursor = 'auto'
		document.onmousemove = null
		document.onmouseup = null
	}

	dragDom.oncontextmenu = function () {
		return false
	}
}

const View = (props: ModalProps) => {
	console.log('props', props)
	const { children, wrapClassName: propsWrapClassName, ...attrs } = props
	const [wrapClassName, setWrapClassName] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	useEffect(() => {
		if (props.open && !isOpen) {
			setIsOpen(false)
			uuId++
			let className = `model-drag-${uuId}`
			if (isTrue(propsWrapClassName)) {
				className = propsWrapClassName + ' ' + wrapClassName
			}
			setWrapClassName(className)
			setTimeout(() => {
				const dom = document.querySelector(`.${className}`)

				let isDrag = false
				// @ts-ignore
				dom.querySelector('.ant-modal-title').onmousedown = () => {
					isDrag = true
				}
				// @ts-ignore
				dom.querySelector('.ant-modal-title').onmouseup = () => {
					isDrag = false
				}
				drag(dom, () => {
					return isDrag
				})
			}, 100)
		}
	}, [props.open])

	return <Modal {...{ wrapClassName, title: '弹窗', ...attrs }}>{children}</Modal>
}

export { View as default }
View.createModal = createModal
View.createModal = createModal
View.createElement = createElement
