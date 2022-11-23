import { ModalProps } from 'antd/lib/modal/Modal'
import React, { useRef, useState } from 'react'

import { useAsyncState } from '../../utils'
import HtForm from '../Form'
import { _FormType } from '../Form/indexType'
import Modal from '../Modal'
const { useFormData } = HtForm
interface propertiesType {
	formConfig: Omit<_FormType, 'onFinish' | 'value'> & {
		onFinish?: (formValue: ObjectMap, value?: ObjectMap) => Promise<boolean>
		defaultValue?: ObjectMap
	}
	modalConfig?: Omit<ModalProps, 'open' | 'onCancel' | 'okButtonProps'>
}
const { createElement } = Modal

let _FormModal: React.FC<propertiesType & createElementProps> = properties => {
	const { getContainer, createResolve, createReject, formConfig, modalConfig } = properties
	const { onFinish: propertiesOnFinish, defaultValue = {}, ...propertiesFormAttributes } = formConfig
	const { ...attributes } = useFormData(defaultValue)
	const openState = useRef<string>()
	const formValueData = useRef<ObjectMap>()
	const [loading, setLoading] = useState(false)
	const { setValue, value } = attributes
	const [open, setOpen] = useAsyncState(true, item => {
		if (!item) {
			if (openState.current === 'onCancel') {
				createReject?.(true)
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
			openState.current = 'onFinish'
			formValueData.current = { formValue: item, value }
			setOpen(false)
		}
	}

	function onCancel(): void {
		openState.current = 'onCancel'
		setOpen(false)
	}

	return (
		<Modal
			{...{ maskClosable: true, ...modalConfig, getContainer, open, onCancel }}
			okButtonProps={{ htmlType: 'submit', form: 'formModal', loading }}>
			<HtForm {...{ col: { span: 24 }, ...propertiesFormAttributes, fId: 'formModal', ...attributes, onFinish, onChange: setValue }} />
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
