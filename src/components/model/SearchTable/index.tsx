import React, { useEffect, useMemo, useState } from 'react'
import HtForm from '../Form'
import { _FormType, searchColumnsItem } from '../Form/indexType'
import { Table } from 'antd'
import { setOptionsDefData, useRequest } from './hooks'
import { isArray, isTrue, deepClone, debounce } from 'html-mzc-tool'
import CheckedTag, { listSearchType } from './model/CheckedTag'
import Search from './model/Search'
import { TableProps } from 'antd/lib/table/Table'
import { getFormValueFromName } from '../Form/uitls/tool'
import { setSlotComponents, setSlotValueOther, setSlotValueMethod } from '../Form/uitls'

const { useFormData } = HtForm

const selectSlotMethodWatchDebounce: typeof selectSlotMethodWatch = debounce(selectSlotMethodWatch, 150)
function selectSlotMethodWatch(selectSlotValueOther, stateData) {
	selectSlotValueOther.forEach(item => {
		setSlotValueOther(item.selectSlot, stateData)
		setSlotValueMethod(item.selectSlot, stateData)
	})
}

type searchType = Omit<_FormType, 'value' | 'valueData' | 'setValue' | 'loading' | 'onChange' | 'columns'> & { columns: searchColumnsItem[] }

type searchTableType = {
	search: searchType & Required<Pick<searchType, 'columns' | 'fId'>>
	table: Omit<TableProps<any>, 'pagination' | 'loading' | 'dataSource'> & Required<Pick<TableProps<any>, 'columns' | 'rowKey'>>
	checkedListSearch?: listSearchType[]
	useRequest: {
		apiRequest: (item: ObjectMap) => Promise<any>
		onSuccess: (item: ObjectMap, pageConfig?: { pageSize: number; current: number }) => ObjectMap[]
		defaultParams?: ObjectMap
		setSearchData?: (item: ObjectMap) => ObjectMap
	}
}

let View = (props: searchTableType) => {
	const { search: propsSearch, table: propsTable, checkedListSearch, useRequest: propsUseRequest } = props
	const { onFinish: propsOnFinish, columns, fId, ...searchAttrs } = propsSearch || {}
	const { apiRequest, onSuccess, defaultParams = {}, setSearchData: propsSetSearchData } = propsUseRequest || {}

	const { value, valueData, setValue, valueOtherData } = useFormData({})
	const [dataSource, setDataSource] = useState([])
	const [searchData, setSearchData] = useState({})

	function onFinish(value) {
		const data = deepClone(value)
		setSearchData(data)
		search(data)
		if (isTrue(propsOnFinish)) {
			propsOnFinish(data)
		}
	}
	function onReset() {
		setSearchData({})
		setValue({})
		search({})
	}
	const { search, loading, Pagination, current, pageSize } = useRequest(apiRequest, {
		defaultParams: defaultParams,
		onSuccess(item) {
			const apiData = onSuccess(item, { current, pageSize })
			if (isTrue(apiData) && isArray(apiData)) {
				setDataSource(apiData)
			}
		},
		setSearchData(item) {
			let data = deepClone(item)
			if (isTrue(selectSlotValueOther)) {
				selectSlotValueOther.forEach(res => {
					const nameData = getFormValueFromName(data, res.name)
					if (isTrue(nameData) && res.setSearchData) {
						data = res.setSearchData(data, nameData)
					}
				})
			}
			if (propsSetSearchData) {
				data = propsSetSearchData(data)
			}

			return data
		}
	})
	useEffect(() => {
		search({})
	}, [])

	const [selectSlotValueOther, setSelectSlotValueOther] = useState([])

	const searchColumns = useMemo(() => {
		const mapList = []
		const data = columns.map(item => {
			if (isTrue(item.selectSlot)) {
				mapList.push(item)
				item.render = stateData => {
					return setSlotComponents(item.selectSlot, stateData)
				}
			}
			return item
		})
		setSelectSlotValueOther(mapList)
		return data
	}, [columns])

	useEffect(() => {
		const stateData = { value, setValue, valueOtherData }
		selectSlotMethodWatchDebounce(selectSlotValueOther, stateData)
	}, [value])

	// 只监听 searchData 和 checkedListSearch 所以搜索时记得更新searchData
	const listSearch = useMemo(() => {
		let listData: listSearchType[] = [
			{
				value: searchData,
				columns: columns as any,
				valueOtherData
			}
		]
		if (isTrue(checkedListSearch)) {
			listData = [...checkedListSearch, ...listData]
		}
		return listData
	}, [searchData, checkedListSearch])

	function onSearch(value) {
		// 改变CheckedTag的值
		onFinish(value)
		// 改变search的值
		setValue(value)
	}

	return (
		<div>
			<div>View</div>
			<Search
				loading={loading}
				fId={fId}
				value={value}
				valueData={valueData}
				setValue={setValue}
				columns={searchColumns}
				valueOtherData={valueOtherData}
				onChange={setValue}
				onFinish={onFinish}
				{...{ ...searchAttrs, onReset: onReset }}
			/>
			<CheckedTag listSearch={listSearch} onSearch={onSearch} />
			<Table loading={loading} pagination={false} dataSource={dataSource} {...propsTable} />
			<Pagination />
		</div>
	)
}
View = React.memo(View)
export default View as typeof View & {
	setOptionsDefData: typeof setOptionsDefData
}
// @ts-ignore
View.setOptionsDefData = setOptionsDefData
