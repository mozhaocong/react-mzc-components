import React, { useEffect, useMemo, useState } from 'react'
import HtForm from '../Form'
import { _FormType } from '../Form/indexType'
import { Table } from 'antd'
import { useRequest } from './hooks'
import { isArray, isTrue, deepClone } from 'html-mzc-tool'
import CheckedTag, { listSearchType } from './model/CheckedTag'
import Search from './model/Search'
import { TableProps } from 'antd/lib/table/Table'
import { getFormValueFromName, setSlotValueOther } from '../Form/uitls/tool'

const { useFormData } = HtForm

type searchTableType = {
	search: Omit<_FormType, 'value' | 'valueData' | 'setValue' | 'loading' | 'onChange'> &
		Required<Pick<_FormType, 'columns' | 'fId'>> & {
			setItemList?: Array<{
				name: any
				setChecked?: (item: ObjectMap) => React.ReactElement
				setSearchData?: (item: ObjectMap, nameData: ObjectMap) => ObjectMap
			}>
			slotList: any
		}
	table: Omit<TableProps<any>, 'pagination' | 'loading' | 'dataSource'> & Required<Pick<TableProps<any>, 'columns' | 'rowKey'>>
	checkedListSearch?: listSearchType[]
	useRequest: {
		apiRequest: (item: ObjectMap) => Promise<any>
		onSuccess: (item: ObjectMap, pageConfig?: { pageSize: number; current: number }) => ObjectMap[]
		defaultParams?: ObjectMap
		setSearchData?: (item: ObjectMap) => ObjectMap
	}
}

const View = (props: searchTableType) => {
	const { search: propsSearch, table: propsTable, checkedListSearch, useRequest: propsUseRequest } = props
	const {
		// @ts-ignore
		onFinish: propsOnFinish,
		columns,
		fId,
		setItemList,
		slotList,
		...searchAttrs
	} = propsSearch || {}
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
			if (isTrue(setItemList)) {
				setItemList.forEach(res => {
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

	// 只监听 searchData 和 checkedListSearch 所以搜索时记得更新searchData
	const listSearch = useMemo(() => {
		let listData: listSearchType[] = [
			{
				value: searchData,
				columns: columns as any,
				valueOtherData,
				setItemList
			}
		]
		if (isTrue(checkedListSearch)) {
			// @ts-ignore
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

	useEffect(() => {
		columns.forEach(item => {
			if (isTrue(slotList)) {
				const slotData = slotList[item.slotName]
				if (item.slotName && slotData) {
					const { initialValue, slotList } = slotData
					slotList.forEach(slotItem => {
						if (slotItem.key === initialValue.select) {
							setSlotValueOther(slotData, valueOtherData, slotItem.label)
						}
					})
				}
			}
		})
	}, [slotList])

	return (
		<div>
			<div>View</div>
			<Search
				loading={loading}
				fId={fId}
				value={value}
				valueData={valueData}
				setValue={setValue}
				columns={columns}
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

export default React.memo(View)
