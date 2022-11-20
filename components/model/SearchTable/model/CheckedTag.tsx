import { Tag } from 'antd'
import { deepClone, isNumber, isString, isTrue } from 'html-mzc-tool'
import React, { Fragment, useMemo } from 'react'

import { getFormValueFromName, setFormNameToValue } from '../../Form/uitls/tool'

type columnType = { label?: string; name: string; setChecked?: any }

export type listSearchType = {
	value: ObjectMap
	columns: columnType[]
	valueOtherData?: { value: ObjectMap }
	onClose?: (item: any) => void
	[index: string]: any
}

type getTagType = tagItemType & columnType & { nameData: any }

export type tagItemType = listSearchType

const CheckedTag = (props: { listSearch: listSearchType[] }) => {
	const { listSearch } = props
	const listTag = useMemo(() => {
		const data = []
		listSearch.forEach(item => {
			const { value, columns, ...attrs } = item
			if (!isTrue(value)) return
			columns.forEach(res => {
				const nameData = getFormValueFromName(value, res.name)
				if (isTrue(nameData)) {
					data.push(deepClone({ ...attrs, ...res, value, nameData }))
				}
			})
		})
		return data
	}, [listSearch])
	if (!isTrue(listTag)) return <></>

	function getTag(item: getTagType) {
		const { label, setChecked } = item
		let { nameData } = item
		let checkedData = ''
		if (isTrue(setChecked)) {
			checkedData = setChecked(item)
			if (isTrue(checkedData)) {
				if (isString(checkedData) || isNumber(checkedData)) {
					nameData = checkedData
				} else {
					return checkedData
				}
			}
		}

		if (!((isString(nameData) || isNumber(nameData)) && isTrue(label))) {
			return <></>
		}
		return (
			<span className={'checked-span'}>
				<span>{label}:</span>
				<Tag closable onClose={e => closeTag(e, item)}>
					{nameData}
				</Tag>
			</span>
		)
	}

	function closeTag(e: any, item: getTagType) {
		e.preventDefault()
		const { value, name, onClose } = item
		const data = setFormNameToValue(value, name, () => undefined)
		onClose(data)
	}

	return (
		<div>
			<span className={'checked-span'}>全部结果 {'>'}</span>
			{listTag.map((item, index) => {
				return <Fragment key={index}>{getTag(item)}</Fragment>
			})}
		</div>
	)
}

export default React.memo(CheckedTag)
