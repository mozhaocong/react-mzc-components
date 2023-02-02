import './index.less'

import { Button, Spin, Table } from 'antd'
import { TableProps } from 'antd/lib/table/Table'
import { deepClone, isArray, isTrue, objectFilterNull } from 'html-mzc-tool'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import HtForm from '../Form'
import { _FormType } from '../Form/indexType'
import { getFormValueFromName } from '../Form/uitls/tool'
import { setOptionsDefData, useRequest } from './hooks'
import { searchColumnsItem } from './indexType'
import CheckedTag, { listSearchType } from './model/CheckedTag'
import Search from './model/Search'
import { setSlotComponents } from './model/setSlotComponents'

const { useFormData } = HtForm

type searchType = Omit<_FormType, 'value' | 'valueData' | 'setValue' | 'loading' | 'onChange' | 'columns'> & { columns: searchColumnsItem[] }

type searchTableType = {
	search: searchType &
		Required<Pick<searchType, 'columns' | 'fId'>> & {
			defaultValue?: ObjectMap
		}
	table?: Omit<TableProps<any>, 'pagination' | 'loading' | 'dataSource'> & Required<Pick<TableProps<any>, 'columns' | 'rowKey'>>
	tableSlot?: () => React.ReactElement
	checkedListSearch?: listSearchType[]
	useRequest: {
		manual?: boolean
		apiRequest: (item: ObjectMap) => Promise<any>
		onSuccess: (item: ObjectMap, pageConfig?: { pageSize: number; current: number }) => ObjectMap[]
		onCallBack?: () => void // 接口请求完成 回调函数
		defaultParams?: ObjectMap
		setSearchData?: (item: ObjectMap) => ObjectMap
		getSearchData?: (item: ObjectMap) => void
	}
	searchRef?: { current: any }
	slot?: React.ReactElement
	loading?: boolean
	onLoadingChange?: (item: boolean) => void
}

let View = (props: searchTableType) => {
	const {
		search: propsSearch,
		table: propsTable,
		checkedListSearch,
		useRequest: propsUseRequest,
		slot = <></>,
		searchRef,
		loading: propsLoading,
		onLoadingChange,
		tableSlot
	} = props
	const { onFinish: propsOnFinish, columns, fId, defaultValue = {}, ...searchAttrs } = propsSearch || {}
	const {
		apiRequest,
		onSuccess,
		defaultParams = {},
		setSearchData: propsSetSearchData,
		onCallBack,
		manual = true,
		getSearchData
	} = propsUseRequest || {}

	const { value, valueData, setValue, valueOtherData } = useFormData(defaultValue)
	const [dataSource, setDataSource] = useState([])
	// 搜索后显示搜索结果
	const [searchCheckedData, setSearchCheckedData] = useState({})
	// search slotList 的数据
	const [selectSlotValueOther, setSelectSlotValueOther] = useState([])
	const tableRef = useRef()
	// const [tableY, setTableY] = useState(100)

	function onFinish(values) {
		const data = objectFilterNull(values)
		setSearchCheckedData(data)
		search(data)
		if (isTrue(propsOnFinish)) {
			propsOnFinish(data)
		}
	}
	function onReset() {
		const data = {}
		selectSlotValueOther.forEach(item => {
			const { initialValue, name, slotList } = item.selectSlot
			if (isTrue(initialValue?.select)) {
				data[name] = { select: initialValue?.select, option: undefined }
			} else if (slotList?.[0]?.key) {
				data[name] = { select: slotList?.[0]?.key, option: undefined }
				// data[name] = slotList?.[0]?.key
			}
		})
		setSearchCheckedData(data)
		setValue(data)
		search({})
	}
	const { refresh, run, search, loading, Pagination, current, pageSize } = useRequest(apiRequest, {
		defaultParams: defaultParams,
		onCallBack() {
			onCallBack?.()
		},
		onSuccess(item) {
			const apiData = onSuccess(item, { current, pageSize })
			setDataSource([])
			if (isTrue(apiData) && isArray(apiData)) {
				setDataSource(apiData)
			}
		},
		setSearchData(item) {
			let data = deepClone(item)
			// 查询 columns 有setSearchData 就调用
			columns.forEach(res => {
				const nameData = getFormValueFromName(data, res.name)
				if (isTrue(nameData) && res.setSearchData) {
					data = res.setSearchData(data, nameData)
				}
			})
			if (propsSetSearchData) {
				data = propsSetSearchData(data)
			}
			const returnData = objectFilterNull(data)
			getSearchData?.(returnData)
			return returnData
		}
	})

	useEffect(() => {
		if (manual) {
			search(value)
		}
	}, [])

	useEffect(() => {
		if (onLoadingChange) {
			onLoadingChange(loading)
		}
	}, [loading])

	if (searchRef) {
		searchRef.current = {
			refresh,
			run,
			setSearchCheckedData
		}
	}

	const searchColumns = useMemo(() => {
		const mapList = []
		const data = columns.map(item => {
			if (isTrue(item.selectSlot)) {
				mapList.push(item)
				item.render = stateData => {
					// return setSlotComponents(item.selectSlot, stateData)
					return setSlotComponents(item, stateData)
				}
			}
			return item
		})
		setSelectSlotValueOther(mapList)
		return data
	}, [columns])

	// 只监听 searchData 和 checkedListSearch 所以搜索时记得更新searchData
	const listSearch = useMemo(() => {
		let listData: listSearchType[] = [
			{
				value: searchCheckedData,
				columns: columns as any,
				valueOtherData,
				valueData,
				onClose: onSearch
			}
		]
		if (isTrue(checkedListSearch)) {
			listData = [...checkedListSearch, ...listData]
		}
		return listData
	}, [searchCheckedData, checkedListSearch])

	// // 输入直接更新
	// const listSearch = useMemo(() => {
	// 	let listData: listSearchType[] = [
	// 		{
	// 			value: value,
	// 			columns: columns as any,
	// 			valueOtherData,
	// 			onClose: onSearch
	// 		}
	// 	]
	// 	if (isTrue(checkedListSearch)) {
	// 		listData = [...checkedListSearch, ...listData]
	// 	}
	// 	return listData
	// }, [value, checkedListSearch])

	function onSearch(value) {
		// 改变CheckedTag的值
		onFinish(value)
		// 改变search的值
		setValue(value)
	}

	// useEffect(() => {
	// 	if (tableSlot || !tableRef?.current) return
	// 	function setTest() {
	// 		// @ts-ignore
	// 		const y = tableRef?.current?.querySelector('.table-dom').clientHeight - tableRef?.current?.querySelector('.ant-table-header').clientHeight
	// 		setTableY(y)
	// 	}
	// 	const debounceTest = debounce(setTest, 100)
	//
	// 	const resizeObserver = new ResizeObserver(() => {
	// 		debounceTest()
	// 	})
	// 	// @ts-ignore
	// 	const documentData = tableRef?.current?.querySelector('.table-dom')
	// 	// start observing a DOM node
	// 	resizeObserver.observe(documentData)
	// 	return () => {
	// 		resizeObserver.unobserve(documentData)
	// 	}
	// }, [tableRef])

	return (
		<div ref={tableRef} className={'search-table-components'}>
			<div className={'search-search-block'}>
				<Search
					onReset={onReset}
					// loading={propsLoading ?? loading}
					fId={fId}
					value={value}
					valueData={valueData}
					setValue={setValue}
					columns={searchColumns}
					valueOtherData={valueOtherData}
					onChange={setValue}
					onFinish={onFinish}
					{...{ ...searchAttrs }}
				/>
				<CheckedTag className={'search-checkedTag-button-block'} listSearch={listSearch} />
			</div>
			<div className={'search-table-block'}>
				{slot}
				{tableSlot ? (
					tableSlot()
				) : (
					<div className={'table-dom'}>
						<Table loading={propsLoading ?? loading} pagination={false} dataSource={dataSource} {...{ sticky: true, ...propsTable }} />
					</div>
				)}
				<Pagination />
			</div>
		</div>
	)
}
View = React.memo(View)

function useSearchRef(): {
	current: {
		refresh: any
		run: any
		setSearchCheckedData: any
	}
} {
	return useRef()
}

export default View as typeof View & {
	setOptionsDefData: typeof setOptionsDefData
	useSearchRef: typeof useSearchRef
}
// @ts-ignore
View.setOptionsDefData = setOptionsDefData
// @ts-ignore
View.useSearchRef = useSearchRef
