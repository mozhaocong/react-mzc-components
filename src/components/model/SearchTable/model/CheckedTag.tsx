import React, { Fragment, useMemo } from 'react'
import { deepClone, isString, isTrue, objectRecursiveMerge } from 'html-mzc-tool'
import { Tag } from 'antd'
import { getFormValueFromName, setFormNameToValue } from '../../Form/uitls/tool'

type checkedName = string | number | Array<string | number>

export type listSearchType = {
	value: ObjectMap
	columns: columnType[]
	setItemList?: {
		name: checkedName
		setChecked?: (item: tagItemType) => React.ReactElement
		[index: string]: any
	}[]
	valueOtherData?: { value: ObjectMap }
}

type columnType = { label: string; name: string }
export type tagItemType = Omit<listSearchType, 'columns'> & columnType & { onSearch: (item) => void; nameData: any }

export function baseSetChecked(config: {
	item: tagItemType
	label?: string
	text?: string
	closeName: checkedName
	propsName?: Array<string | number> | string | number
	setOption?: (item: ObjectMap, nameData: any) => string | number | undefined
	setLabel?: (item: ObjectMap, nameData: any) => string | number | undefined
}): React.ReactElement {
	const { item, label = 'selectLabel', text = 'option', closeName = ['spPlatform', 'option'], propsName, setOption, setLabel } = config
	const { value, valueOtherData } = item
	const data = objectRecursiveMerge(value, valueOtherData.value)

	let option
	let selectLabel
	let nameData = data
	if (isTrue(propsName)) {
		nameData = getFormValueFromName(data, propsName)
	}
	selectLabel = nameData[label]
	option = nameData[text]
	if (setOption) {
		option = setOption(data, nameData)
	}
	if (setLabel) {
		selectLabel = setLabel(data, nameData)
	}

	function closeTag(e, item) {
		const { onSearch } = item
		e.preventDefault()
		const data = setFormNameToValue(value, closeName, () => undefined)
		onSearch(data)
	}
	if (isTrue(selectLabel) && isTrue(option)) {
		return (
			<Tag closable onClose={e => closeTag(e, item)}>
				{selectLabel}: {option}
			</Tag>
		)
	} else {
		return <></>
	}
}

const CheckedTag = (props: { listSearch: listSearchType[]; onSearch: (item: ObjectMap) => void }) => {
	const { listSearch, onSearch } = props
	const listTag = useMemo(() => {
		const data = []
		listSearch.forEach(item => {
			const { value, columns, ...attrs } = item
			if (!isTrue(value)) return
			columns.forEach(res => {
				const nameData = getFormValueFromName(value, res.name)
				if (isTrue(nameData)) {
					data.push(deepClone({ ...res, ...attrs, value, nameData, onSearch }))
				}
			})
		})
		return data
	}, [listSearch])
	if (!isTrue(listTag)) return <></>

	function closeTag(e: any, item: tagItemType | { [index: string]: any }) {
		e.preventDefault()
		const { value, name } = item
		const data = setFormNameToValue(value, name, () => undefined)
		onSearch(data)
	}
	function getTag(item: tagItemType) {
		const { label, name, setItemList, nameData } = item
		if (!(isString(nameData) && isTrue(label))) {
			if (isTrue(setItemList)) {
				return (
					setItemList
						.filter(res => {
							return JSON.stringify(name) == JSON.stringify(res.name) && isTrue(res.setChecked)
						})
						.map(res => res.setChecked)?.[0]?.(item) || []
				)
			}
			return <></>
		}
		return (
			<Tag closable onClose={e => closeTag(e, item)}>
				{label}: {nameData}
			</Tag>
		)
	}

	return (
		<div>
			{listTag.map((item, index) => {
				return <Fragment key={index}>{getTag(item)}</Fragment>
			})}
		</div>
	)
}

export default CheckedTag
