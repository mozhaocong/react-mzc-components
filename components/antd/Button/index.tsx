import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button/button'
import React, { useMemo, useState } from 'react'

interface propertyType extends Omit<ButtonProps, 'onClick'> {
	onClick?: (event: any, setLoading: (item: boolean) => void) => void
	uuid?: string
}

const View: React.FC<propertyType> = properties => {
	const { onClick: propertyOnClick, loading: propertyLoading, ...attributes } = properties
	const [loading, setLoading] = useState(false)
	const loadingData = useMemo(() => {
		return propertyLoading ?? loading
	}, [loading, propertyLoading])
	function onClick(event: any): void {
		propertyOnClick?.(event, setLoading)
	}
	return <Button {...{ ...attributes, loading: loadingData, onClick }} />
}
export default React.memo(View)
