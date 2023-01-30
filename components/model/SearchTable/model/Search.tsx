import React from 'react'

import HtForm from '../../Form'
import { _FormType } from '../../Form/indexType'

interface SearchType extends _FormType {
	loading: boolean
	fId: string
	onReset: any
}

const Search: React.FC<SearchType> = props => {
	const { value, columns, ...attrs } = props

	return <HtForm {...{ value, columns: columns, ...attrs }} />
}

export default Search
