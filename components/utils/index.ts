import { useEffect, useState } from 'react'

export function useAsyncState(item: any, callback?: (item: any) => void): any[] {
	const [value, setValue] = useState(item)
	useEffect(() => {
		callback?.(value)
	}, [value])
	return [value, setValue]
}
