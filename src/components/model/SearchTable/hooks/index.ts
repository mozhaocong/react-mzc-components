import Pagination from '../model/Pagination'
import { ReactElement, useState } from 'react'
import { isObject, isTrue, objectFilterEmpty } from 'html-mzc-tool'

let optionsDefData = {
	apiSuccessfulVerification: (item: ObjectMap): boolean => {
		return item?.code === 200
	}, // 接口成功校验
	paginationReq: ['data'], // 分页参数 字段
	paginationConfig: {
		current: 'current_page',
		pageSize: 'per_page',
		total: 'total'
	},
	setPaginationParam: {
		current: 'page',
		pageSize: 'size'
	}
}

export function setOptionsDefData(item: typeof optionsDefData) {
	optionsDefData = item
}

type optionsType = {
	setSearchData?: (item: ObjectMap) => ObjectMap
	customizeRun?: (item: ObjectMap) => Promise<any>
	defaultParams?: ObjectMap
	onSuccess?: (item: ObjectMap) => void
}

export function useRequest(request: (item: ObjectMap) => Promise<any>, options: optionsType = {}) {
	const [loading, setLoading] = useState(false)
	const [current, setCurrent] = useState(1)
	const [pageSize, setPageSize] = useState(1)
	const [total, setTotal] = useState('')
	const [param, setParam] = useState({})

	function resetPagination(is = true) {
		return {
			[optionsDefData.setPaginationParam.current]: is ? '' : current,
			[optionsDefData.setPaginationParam.pageSize]: is ? '' : pageSize
		}
	}

	async function search(data: ObjectMap = {}, config: { resetPagination: boolean } = { resetPagination: true }) {
		let is = true
		if (isObject(config)) {
			const { resetPagination = true } = config
			is = resetPagination
		}
		const params = { ...data, ...resetPagination(is) }
		await run(params)
	}

	async function refresh(isResetPagination = false) {
		const item = { ...param, ...resetPagination(isResetPagination) }
		await run(item)
	}

	async function run(data = {}) {
		setLoading(true)
		let params = objectFilterEmpty({
			...(options.defaultParams || {}),
			...data
		})
		setParam(params)
		let item: any = {}

		if (options.setSearchData) {
			params = options.setSearchData(params)
		}

		if (options.customizeRun) {
			item = await options.customizeRun(params)
		} else {
			item = await request(params)
		}
		if (!isTrue(item)) {
			throw '请求接口错误'
		}
		if (optionsDefData.apiSuccessfulVerification(item)) {
			const optionsData = { ...optionsDefData, ...options }
			let paginationReqData: any = {}
			if (isTrue(optionsData.paginationReq)) {
				paginationReqData = item
				optionsData.paginationReq.forEach((res: any) => {
					try {
						paginationReqData = paginationReqData[res]
					} catch (e) {
						console.log('optionsData.paginationReq 数据不对')
						paginationReqData = {}
					}
				})
			}

			if (isTrue(paginationReqData) && isObject(paginationReqData)) {
				setCurrent(paginationReqData[optionsData?.paginationConfig?.current] ?? 1)
				setPageSize(paginationReqData[optionsData?.paginationConfig?.pageSize] ?? 1)
				setTotal(paginationReqData[optionsData?.paginationConfig?.total] ?? '')
			}

			if (options.onSuccess) {
				options.onSuccess(item)
			}
		}

		setLoading(false)
	}

	return {
		run,
		loading,
		current,
		pageSize,
		setLoading,
		refresh,
		resetPagination,
		search,
		Pagination: (props: any): ReactElement =>
			Pagination({
				current,
				pageSize,
				total,
				loading,
				onChange: (item: any) => {
					// 点击回到顶
					// if (isTrue(options.scrollbarsTop)) {
					//   const booleanOrDom = options.scrollbarsTop
					//   if (isBoolean(booleanOrDom) && booleanOrDom) {
					//     scrollbarsTop()
					//   } else {
					//     scrollbarsTop(booleanOrDom())
					//   }
					// }

					const optionsData = { ...optionsDefData, ...options }
					const itemParam = {
						...param,
						[optionsData.setPaginationParam.current]: item.current,
						[optionsData.setPaginationParam.pageSize]: item.pageSize
					}
					if (props.onChange) {
						props.onChange()
					}
					run(itemParam)
				},
				onShowSizeChange: (item: any) => {
					const optionsData = { ...optionsDefData, ...options }
					const itemParam = {
						...param,
						[optionsData.setPaginationParam.current]: item.current,
						[optionsData.setPaginationParam.pageSize]: item.pageSize
					}
					run(itemParam)
				}
			}) as ReactElement
	}
}
