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
	const styleData: any = { textAlign: 'right', padding: '8px 8px 0', borderTop: '1px solid #EEE', position: 'sticky', bottom: 0, background: '#FFF' }
	return (
		<div style={styleData}>
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
	)
}
