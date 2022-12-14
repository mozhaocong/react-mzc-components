import { Button } from 'antd'
import React, { useMemo, useState } from 'react'

import { HtForm } from '@/components'
import { formRows } from '@/view/testForm/configData'
const { useFormData } = HtForm

const App = () => {
	const [form, seForm] = useState()
	const formData = useMemo(() => {
		return new formRows({ formRef: form }).data
	}, [form])

	const { value, setValue, valueData } = useFormData({
		name: 'ASGASGA'
	})

	console.log('1')
	return (
		<div>
			{/*<HtSelect options={configBusinessDataOptions.integralType} />*/}
			<HtForm
				labelWrap
				propsForm={seForm}
				columns={formData}
				value={value}
				onChange={setValue}
				setValue={setValue}
				valueData={valueData}
				publicProps={{ allowClear: true }}
			/>
			<div>{JSON.stringify(value)}</div>
			<Button
				onClick={() => {
					console.log('value', valueData)
					setValue({ ...value, tata: 1 })
				}}>
				value
			</Button>
		</div>
	)
}

export default App
