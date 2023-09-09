import { ModalProps } from 'antd/lib/modal/Modal'
import React, { useRef, useState } from 'react'

import { useAsyncState } from '../../utils'
import HtForm from '../Form'
import { _FormType } from '../Form/indexType'
import Modal from '../Modal'
const { useFormData } = HtForm
interface propertiesType {
	formConfig: Partial<Omit<_FormType, 'onFinish' | 'value'>> & {
		onFinish?: (formValue: ObjectMap, value?: ObjectMap) => Promise<boolean>
		defaultValue?: ObjectMap
		render?: (item: any) => React.ReactElement
	}
	modalConfig?: Omit<ModalProps, 'open' | 'onCancel' | 'okButtonProps'>
}
const { createElement } = Modal

let _FormModal: React.FC<propertiesType & createElementProps> = properties => {
	const { getContainer, createResolve, createReject, formConfig, modalConfig } = properties
	const { onFinish: propertiesOnFinish, defaultValue = {}, render, ...propertiesFormAttributes } = formConfig
	const { ...attributes } = useFormData(defaultValue)
	const formValueData = useRef<ObjectMap | boolean>()
	const [loading, setLoading] = useState(false)
	const { setValue, value } = attributes
	const [open, setOpen] = useAsyncState(true, item => {
		if (!item) {
			if (!formValueData.current) {
				createReject?.(false)
			} else {
				createResolve?.(formValueData.current)
			}
		}
	})

	async function onFinish(item: any): Promise<void> {
		let state = true
		if (propertiesOnFinish) {
			setLoading(true)
			state = await propertiesOnFinish(item, value)
			setLoading(false)
		}
		if (state) {
			formValueData.current = { formValue: item, value }
			setOpen(false)
		}
	}

	function onCancel(): void {
		formValueData.current = false
		setOpen(false)
	}

	return (
		<Modal
			{...{ maskClosable: false, ...modalConfig, getContainer, open, onCancel }}
			okButtonProps={{ htmlType: 'submit', form: 'formModal', loading }}>
			<div style={{ maxHeight: '50vh', overflow: 'auto' }}>
				{render ? (
					render({ formValueData, setOpen })
				) : (
					// @ts-ignore
					<HtForm
						{...{ col: { span: 24 }, labelAlign: 'left', ...propertiesFormAttributes, fId: 'formModal', ...attributes, onFinish, onChange: setValue }}
					/>
				)}
			</div>
		</Modal>
	)
}

_FormModal = React.memo(_FormModal)
export default _FormModal as typeof _FormModal & {
	createFormModal: typeof createFormModal
}
function createFormModal(item: propertiesType): Promise<any> {
	return createElement(<_FormModal {...item} />)
}
// @ts-ignore
_FormModal.createFormModal = createFormModal
