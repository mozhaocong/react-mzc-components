import React from 'react'

import HtForm from '../../Form'
import { _FormType } from '../../Form/indexType'

const Search = (props: _FormType) => {
	const { value, columns, ...attrs } = props

	return <HtForm {...{ value, columns, ...attrs }} />
}

export default Search
