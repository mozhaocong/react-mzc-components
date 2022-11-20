export function mockDataSource(item: any[], nubData = 10): any[] {
	const data = item.map(response => {
		return { key: response.dataIndex ?? response.key }
	})
	let nub = 0
	return [...Array.from({ length: nubData })].map(() => {
		const returnData: any = { id: nub }
		nub++
		for (const item of data) {
			returnData[item.key] = nub
			nub++
		}
		return returnData
	})
}
