import { Pagination, Spin } from 'antd'
import React from 'react'

export default (
	props: any = {
		current: 1,
		total: 50,
		pageSize: 10
	}
) => {
	if (!props.total) return ''
	return (
		<div className={'table-pagination'}>
			<div className={'table-pagination-div'}>
				<Spin spinning={props.loading ?? false}>
					<Pagination
						size='small'
						current={props.current || 1}
						total={props.total || 50}
						showTotal={total => `总条数 ${total}`}
						pageSize={props.pageSize || 10}
						showSizeChanger
						showQuickJumper={true}
						pageSizeOptions={[50, 100, 150]}
						onChange={(current, pageSize) => {
							if (props.onChange) {
								props.onChange({ current, pageSize })
							}
						}}
						onShowSizeChange={(current, pageSize) => {
							if (props.onShowSizeChange) {
								props.onShowSizeChange({ current, pageSize })
							}
						}}
					/>
				</Spin>
			</div>
		</div>
	)
}
