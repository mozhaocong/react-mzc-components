import { Button } from '@components/antd'
import { ColumnType } from 'antd/lib/table/interface'
import { deepClone, isTrue } from 'html-mzc-tool'
import moment, { isMoment } from 'moment/moment'
import React from 'react'

import { columnsItem, ColumnTypeForm, formListPublicProps, formName, formPublicProps, formTablePublicProps } from '../Form/indexType'
import { getFormValueFromName, setFormNameToValue } from '../Form/uitls/tool'

function momentValueToString(value: any, format = 'YYYY-MM-DD HH:mm:ss') {
	return isTrue(value) ? moment(value * 1).format(format) : ''
}

function dataMomentToTimeData(item: any, format = 'x'): any {
	return deepClone(item, response => {
		if (isMoment(response)) {
			return moment(response).format(format)
		}
		return response
	})
}
function dataMomentToTimeStartOf(item: any, type = 'day', format = 'x'): any {
	return deepClone(item, response => {
		if (isMoment(response)) {
			return moment(response)
				.startOf(type as any)
				.format(format)
		}
		return response
	})
}

function dataMomentToTimeEndOf(item: any, type = 'day', format = 'x'): any {
	return deepClone(item, response => {
		if (isMoment(response)) {
			return moment(response)
				.endOf(type as any)
				.format(format)
		}
		return response
	})
}

function serialNumber(item: { index: number; pageSize?: number; current?: number; [index: string]: any }): React.ReactElement {
	let { index, current, pageSize } = item
	index = index ? index * 1 : 0
	current = current ? current * 1 : 0
	pageSize = pageSize ? pageSize * 1 : 0
	let currentPageSize = 0
	if (current) {
		currentPageSize = (current - 1) * pageSize
	}

	const returnData = index + 1 + currentPageSize
	return <div>{returnData}</div>
}

export class BaseFormColumnsItem<T = columnsItem<formPublicProps>> {
	data: Array<T>
	setColumns(item: Array<T>) {
		this.data = item
	}
	momentToArray(item: any[], format = 'YYYY-MM-DD') {
		return isTrue(item)
			? item.map(res => {
					return moment(res).format(format)
			  }) || []
			: []
	}
	momentValueToString = momentValueToString
	dataMomentToTimeData = dataMomentToTimeData
	dataMomentToTimeStartOf = dataMomentToTimeStartOf
	dataMomentToTimeEndOf = dataMomentToTimeEndOf
}

export class BaseFormListColumnsItem extends BaseFormColumnsItem<columnsItem<formListPublicProps>> {}

export class BaseFormTableColumnsItem extends BaseFormColumnsItem<ColumnTypeForm<formTablePublicProps>> {
	actionButton(
		item: formTablePublicProps,
		name: formName,
		itemConfig?: {
			onAdd?: any
			onDelete?: any
			firstDelete?: boolean
			showDelete?: boolean
			hiddenDelete?: boolean
			showAdd?: boolean
			hiddenAdd?: boolean
			buttonType?: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed'
		}
	): React.ReactElement {
		const { value, index, setValue, valueData } = item
		const {
			onAdd,
			onDelete,
			showDelete: showDeleteConfig = true,
			showAdd: showAddConfig = false,
			hiddenAdd = false,
			hiddenDelete = false,
			buttonType = 'link'
		} = itemConfig || {}
		const data = getFormValueFromName(value, name)
		let showDelete = showDeleteConfig
		if (hiddenDelete) {
			showDelete = false
		}
		const showAdd = data.length === index + 1 || showAddConfig
		return (
			<>
				{showDelete && (
					<Button
						type={buttonType}
						onClick={() => {
							if (!isTrue(index)) return
							data.splice(index, 1)
							setValue(
								setFormNameToValue(valueData.value, name, () => {
									return data
								})
							)
							onDelete?.()
						}}>
						删除
					</Button>
				)}
				{showAdd && !hiddenAdd && (
					<Button
						type={buttonType}
						onClick={() => {
							data.push({})
							setValue(
								setFormNameToValue(valueData.value, name, () => {
									return data
								})
							)
							onAdd?.()
						}}>
						添加行
					</Button>
				)}
			</>
		)
	}
	serialNumber = serialNumber
}

export class BaseTableColumns {
	data: ColumnType<any>[]
	setColumns(item: Array<ColumnType<any>>) {
		this.data = item
	}
	momentValueToString = momentValueToString
	serialNumber = serialNumber
}
