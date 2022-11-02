import { Button } from 'antd'
import React from 'react'

import HtForm from '../../Form'
import { _FormType } from '../../Form/indexType'

interface searchType extends _FormType {
	onReset: () => void
}
const Search = (props: searchType) => {
	const { value, onReset, columns, ...attrs } = props
	function onResetClick() {
		onReset()
	}

	return (
		<div>
			<HtForm {...{ value, columns, ...attrs }} />
			<div>
				<Button loading={attrs.loading} htmlType={'submit'} form={attrs.fId}>
					搜索
				</Button>
				<Button loading={attrs.loading} onClick={onResetClick}>
					重置
				</Button>
			</div>
		</div>
	)
}

export default Search
