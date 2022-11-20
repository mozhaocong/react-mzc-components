import React from 'react'

import { getScmEnums } from '@/api/scm/enums'
import { SelectApiParams } from '@/components'
const { useApiData } = SelectApiParams
const View = () => {
	const [value] = useApiData({ apiRequest: getScmEnums, params: { enumNameList: ['DeductType', 'SupplementOrderPurchaseType'] } })
	return (
		<div>
			<div>SelectApiParams</div>
			<div>{JSON.stringify(value)}</div>
		</div>
	)
}
export default React.memo(View)
