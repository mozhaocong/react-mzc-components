import { FormProps } from 'antd/lib/form/Form'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import { ColProps } from 'antd/lib/grid/col'
import { ColumnType } from 'antd/lib/table/interface'
import { GetRowKey } from 'rc-table/lib/interface'
import React from 'react'

export interface _FormType extends FormProps {
	fId?: string //form 的 Id
	loading?: boolean
	columns: Array<columnsItem<formPublicProps>>
	col?: ColProps // 使用 row col 布局
	style?: ObjectMap
	onChange?: (item: ObjectMap) => void
	propsForm?: (formRef: ObjectMap) => void // form 组件初始化后 把 formRef 回传出去
	form?: FormInstance // Form.useForm() 生成的
	value?: ObjectMap
	valueData?: ObjectMap // value的实时值
	setValue?: (item: any) => void // value valueData setValue 三个参数都是从 useFormData 返回的值
	publicProps?: ObjectMap // 组件公共参数
	valueOtherData?: ObjectMap
}

export type formName = string | number | Array<string | number>

export interface _FormListType extends _FormType {
	isForm?: boolean // 是否返回带用form 的组件
	columns: Array<columnsItem<formListPublicProps>>
	formName: formName
}

export interface _FormTableType extends Omit<_FormType, 'columns'> {
	rowKey?: string | GetRowKey<unknown>
	isForm?: boolean // 是否返回带用form 的组件
	columns: Array<ColumnTypeForm<formTablePublicProps>>
	formName: formName
}

export interface ColumnTypeForm<T> extends Omit<ColumnType<unknown>, 'render'>, Pick<FormItemProps, 'rules'> {
	dataIndex?: any
	render?: (item: T) => React.ReactElement
}

export interface formPublicProps {
	value: ObjectMap
	valueData: ObjectMap
	setValue: (item: ObjectMap) => void
	publicProps: ObjectMap
	valueOtherData: ObjectMap
}
export interface formListPublicProps extends formPublicProps {
	res: ObjectMap // 当前条数据的值
	index: number // 当前数据下标
	add: () => void // 添加一条数据
	remove: (fieldName: ObjectMap) => void // 删除一条数组 传参数是 返回的 field.name
	field: ObjectMap // 组件内容生成的当前数据
}

export interface formTablePublicProps extends Omit<formPublicProps, 'formRef'> {
	text: string | ObjectMap
	record: ObjectMap
	index: number
	item: ObjectMap
}

export interface columnsItem<T = ObjectMap> extends Omit<FormItemProps, 'label'> {
	label?: ((item: T) => React.ReactElement | string | number) | string | number
	publicProps?: T
	props?: ObjectMap
	display?: (item: T) => boolean
	render?: (item: T, ...attrs: any) => React.ReactElement
	component?: (item: T) => React.ReactElement
	customRender?: (item: T) => React.ReactElement
	col?: ColProps
	style?: ObjectMap
}
