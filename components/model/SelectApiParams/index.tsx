import { Select } from '@components/antd'
import { SelectProps } from 'antd/lib/select'
import { isNil } from 'ramda'
import React, { forwardRef, useMemo } from 'react'

import { setJudgmentApiSuccess, useApiData } from './hook'

type valueType = string | number

interface callBack {
	value: valueType
	label: valueType
	[index: string]: any
}
interface propertiesType extends Omit<SelectProps, 'options'> {
	apiRequest: (item: ObjectMap) => Promise<any>
	params: ObjectMap
	callBack: (item: ObjectMap) => callBack[]
	isUpdate?: (parameters: any) => boolean
	isReset?: (parameters: any) => boolean
}

// eslint-disable-next-line react/display-name
const View: React.FC<propertiesType> = forwardRef((properties: propertiesType, reference) => {
	const { apiRequest, params, callBack, isUpdate, isReset, ...attributes } = properties

	const [value] = useApiData({ apiRequest, params, isUpdate, isReset })

	if (attributes.mode && attributes.mode === 'multiple' && isNil(attributes.value)) {
		attributes.value = []
	}

	const options = useMemo(() => {
		return callBack(value) || []
	}, [value])

	// @ts-expect-error
	return <Select ref={reference} {...{ style: { width: '100%' }, ...attributes, options }} />
})

const _SelectApiParameters = React.memo(View)

export default _SelectApiParameters as typeof _SelectApiParameters & {
	useApiData: typeof useApiData
	setJudgmentApiSuccess: typeof setJudgmentApiSuccess
}

// @ts-expect-error
_SelectApiParameters.useApiData = useApiData
// @ts-expect-error
_SelectApiParameters.setJudgmentApiSuccess = setJudgmentApiSuccess
