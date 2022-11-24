import { Button } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { isTrue } from 'html-mzc-tool'
import moment from 'moment/moment'
import React from 'react'

import { columnsItem, ColumnTypeForm, formListPublicProps, formName, formPublicProps, formTablePublicProps } from '../Form/indexType'
import { getFormValueFromName, setFormNameToValue } from '../Form/uitls/tool'

function momentValueToString(value: any, format = 'YYYY-MM-DD') {
	return isTrue(value) ? moment(value).format(format) : ''
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
}

export class BaseFormListColumnsItem extends BaseFormColumnsItem<columnsItem<formListPublicProps>> {}

export class BaseFormTableColumnsItem extends BaseFormColumnsItem<ColumnTypeForm<formTablePublicProps>> {
	actionButton(item: formTablePublicProps, name: formName): React.ReactElement {
		const { value, index, setValue } = item
		const data = getFormValueFromName(value, name)
		return (
			<>
				{data.length !== 1 && (
					<Button
						type={'link'}
						onClick={() => {
							data.splice(index, 1)
							setValue(
								setFormNameToValue(value, name, () => {
									return data
								})
							)
						}}>
						删除
					</Button>
				)}
				{data.length === index + 1 && (
					<Button
						type={'link'}
						onClick={() => {
							data.push({})
							setValue(
								setFormNameToValue(value, name, () => {
									return data
								})
							)
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
