import { debounce, isTrue } from 'html-mzc-tool'
import { filter } from 'ramda'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import HtForm from '../../Form'
import { _FormType } from '../../Form/indexType'

interface SearchType extends _FormType {
	loading: boolean
	fId: string
	onReset: any
}

const useResizeObserver = (props: { domRef: any; callBack: () => void; wait?: number }) => {
	const { domRef, callBack, wait = 300 } = props
	const isSetRef = useRef(false)
	const domRefWidth = useRef(0)
	const debounceCallBack = useMemo(() => {
		return debounce(callBack, wait)
	}, [])
	const resizeObserver = new ResizeObserver(() => {
		if (domRefWidth.current !== domRef.clientWidth) {
			debounceCallBack()
		}
		domRefWidth.current = domRef.clientWidth
	})
	useEffect(() => {
		if (isTrue(domRef) && !isSetRef.current) {
			isSetRef.current = true
			try {
				resizeObserver.observe(domRef)
			} catch (e) {}
		}
	}, [domRef])
}

const Search: React.FC<SearchType> = props => {
	const { value, columns, ...attrs } = props
	const divRef = useRef<any>(undefined)
	const isInt = useRef<boolean>(true)
	const [columnsData, setColumnsData] = useState(columns)

	useResizeObserver({
		domRef: divRef.current,
		callBack: () => {
			// console.log('12312')
			isInt.current = true
			setColumnsData(columns)
			// getDomWidth()
		}
	})

	useEffect(() => {
		if (isInt.current) {
			getDomWidth()
		}
	}, [columnsData, isInt])

	function getDomWidth() {
		const divWidth = divRef.current.clientWidth
		const formItemAll = divRef.current?.querySelectorAll('.ant-form-item')
		console.log('formItemAll', formItemAll, divWidth)
		let formItemWidth = 0
		const buttonWidth = 200
		let index = 0
		for (const formItemAllElement of formItemAll) {
			formItemWidth += formItemAllElement.clientWidth
			index += 1
			console.log(index, divWidth, formItemWidth)
			if (divWidth < buttonWidth + formItemWidth) {
				break
			}
			// console.log('index', index)
			// console.log('formItemWidth', formItemWidth)
		}
		isInt.current = false
		console.log('index', index)
		const filterData = columns.filter((filterItem, filterIndex) => {
			return filterIndex < index - 1
		})
		setColumnsData([
			...filterData,
			{
				render: () => {
					return <div>测试</div>
				}
			}
		])
		// divRef.current.
	}

	return (
		// @ts-ignore
		<div className={'search-consent'} style={{ width: '100%' }} ref={divRef}>
			<HtForm {...{ value, columns: columnsData, ...attrs }} />
		</div>
	)
}

export default Search
