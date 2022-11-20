import { columnsItem, formName, formPublicProps } from '@components/model/Form/indexType'
import { ColProps } from 'antd/lib/grid/col'
import React from 'react'

export type slotListType = { label: string; key: string; name?: string; component?: (item: formPublicProps) => React.ReactElement }[]

export interface searchColumnsItem extends columnsItem<formPublicProps> {
	selectSlot?: {
		name: formName // slotComponent 获取value 字段
		initialValue: {
			select: string
		}
		placeholder?: string
		component?: (item: formPublicProps) => React.ReactElement
		slotList: slotListType
		col?: ColProps // 使用 row col 布局
		listSearch?: ColProps // 使用 row col 布局
		wrapperCol?: ColProps // 使用 row col 布局
	}
	setChecked?: (item: ObjectMap) => React.ReactElement | string | number
	setSearchData?: (item: ObjectMap, nameData?: any) => ObjectMap
}
