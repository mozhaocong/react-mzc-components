import { Button } from 'antd'
import React, { useState } from 'react'

import { Modal } from '@/components'
const { createElement, createModal } = Modal

interface modalTestType extends createElementProps {
	cancelText: string
}
const ModalTest = (props: modalTestType) => {
	const [open, setOpen] = useState(true)
	console.log('props', props)
	// return <div>2</div>
	return (
		<Modal
			{...props}
			open={open}
			onCancel={() => {
				// setOpen(false)
				props.createResolve(true)
				props.createReject(true)
			}}>
			<div>123456</div>
		</Modal>
	)
}

export default () => {
	const [open, setOpen] = useState(false)
	function showCreateElement() {
		createElement(<ModalTest cancelText={'123456'} />)
			.then(item => {
				console.log('then', item)
			})
			.catch(item => {
				console.log('catch', item)
			})
	}
	function showCreateModal() {
		const data = createModal({ content: <div>123</div> })
	}

	return (
		<div>
			<Button onClick={showCreateElement}>createElement</Button>
			<Button onClick={showCreateModal}>createModal</Button>
			<Button
				onClick={() => {
					setOpen(true)
				}}>
				Modal
			</Button>
			<Modal
				open={open}
				onCancel={() => {
					setOpen(false)
				}}>
				<div>123</div>
			</Modal>
		</div>
	)
}
