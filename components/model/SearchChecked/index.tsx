import './index.less'

import { Button } from 'antd'
import { deepClone, isFunction, isString, isTrue } from 'html-mzc-tool'
import React, { useEffect, useMemo, useState } from 'react'

import Search from '../Search'
import CheckedTag from '../SearchTable/model/CheckedTag'

type SearchDomType = {
	value: ObjectMap
	onChange: any
	columns: any[]
	listSearch?: any[]
	labelMap?: () => ObjectMap
	valueMap?: () => ObjectMap
	formProps?: ObjectMap
	onSubmit?: () => void
	onReset?: () => void
	propsRef?: any
}

const SearchDom: React.FC<SearchDomType> = props => {
	const {
		value,
		onChange,
		formProps,
		valueMap,
		labelMap,
		columns,
		onSubmit: propsOnSubmit,
		onReset: propsOnReset,
		propsRef,
		listSearch: propsListSearch = []
	} = props
	const [determineValue, setDetermineValue] = useState({})
	const [checkValue, setCheckValue] = useState({})

	const searchColumns = useMemo(() => {
		return deepClone(columns)
	}, [columns])

	const checkValueColumns = useMemo(() => {
		const data = []
		searchColumns.forEach(item => {
			const objectData = setColumnsSetChecked(item)
			if (isString(item[0])) {
				data.push({ name: item[1].name, label: item[0], ...objectData })
			} else {
				data.push({ name: item[1].name, ...SearchMapCheckedTagLabel(item[1].name), ...objectData })
			}
		})
		return data
	}, [searchColumns, checkValue])

	const listSearch = useMemo(() => {
		return [
			...propsListSearch,
			{
				value: checkValue,
				columns: checkValueColumns,
				onClose: (item, name) => {
					const data = deepClone(value)
					data[name] = undefined
					setDetermineValue(data)
					onChange(data)
				}
			}
		]
	}, [checkValueColumns, propsListSearch])

	useEffect(() => {
		let data = deepClone(determineValue)
		data = { ...data, ...SearchMapCheckedTagValue() }
		setCheckValue(data)
	}, [determineValue])

	function setColumnsSetChecked(item) {
		const name = item[1].name
		const data: ObjectMap = valueMap() || {}
		if (isFunction(data[name])) {
			return { setChecked: data[name] }
		}
		return {}
	}

	function onSubmit() {
		setDetermineValue(deepClone(value))
		if (propsOnSubmit) {
			propsOnSubmit()
		}
	}

	useEffect(() => {
		if (propsRef) {
			const current = {
				onSubmit,
				onReset
			}
			propsRef.current = current
		}
	}, [value])

	function onReset() {
		setDetermineValue({})
		onChange({})
		if (propsOnReset) {
			propsOnReset()
		}
	}

	function SearchMapCheckedTagLabel(key: string) {
		return labelMap()?.[key] || {}
	}
	function SearchMapCheckedTagValue() {
		const data: ObjectMap = valueMap() || {}
		const returnData = {}
		for (const datum in data) {
			if (isTrue(data[datum]) && !isFunction(data[datum])) {
				returnData[datum] = data[datum]
			}
		}
		return returnData
	}

	return (
		<div className={'searchChecked-components'}>
			<div className={'search-search-block'}>
				<Search value={value} onChange={onChange} columns={searchColumns} {...formProps} />
				<div className={'search-checkedTag-button-block'}>
					<CheckedTag listSearch={listSearch} />
					<div className={'search-button-block'}>
						<Button onClick={onSubmit}>确定</Button>
						<Button onClick={onReset}>重置</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default React.memo(SearchDom)
