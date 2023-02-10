import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { Button, Col, Input } from '@components/antd'
import { debounce, isString, isTrue } from 'html-mzc-tool'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import HtForm from '../../Form'
import { _FormType } from '../../Form/indexType'

interface SearchType extends _FormType {
	loading?: boolean
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
	const { value, columns: propsColumns, onReset, ...attrs } = props
	const divRef = useRef<any>(undefined)
	const isInt = useRef<boolean>(true)
	const [moreButton, setMoreButton] = useState(false)
	const [showMore, seSHowMore] = useState(true)
	const moreIndex = useRef<number>(0)
	const columns = useMemo(() => {
		return propsColumns.map(mapItem => {
			const { label } = mapItem
			const data: any = {}
			if (isTrue(label) && isString(label)) {
				data.label = <Input readOnly value={label} />
			}
			return { ...mapItem, ...data }
		})
	}, [propsColumns])
	const [columnsData, setColumnsData] = useState(columns)

	useResizeObserver({
		domRef: divRef.current,
		callBack: () => {
			isInt.current = true
			setColumnsData(columns)
		}
	})

	useEffect(() => {
		if (isInt.current) {
			getDomWidth()
		}
	}, [columnsData])

	useEffect(() => {
		setColumnsData(setMoreButtonList())
	}, [moreButton])
	function setMoreButtonList(): any[] {
		const index = moreIndex.current
		const pushData = {
			render: () => {
				return (
					<Col flex={'auto'} style={{ display: 'flex', justifyContent: 'end', minWidth: '300px' }}>
						<div style={{ display: 'flex' }}>
							{showMore && (
								<div style={{ marginRight: '12px', height: '32px', display: 'flex', alignItems: 'center', transform: 'rotate(-90deg)' }}>
									{moreButton ? (
										<DoubleRightOutlined
											style={{ fontSize: '24px' }}
											onClick={() => {
												setMoreButton(!moreButton)
											}}
										/>
									) : (
										<DoubleLeftOutlined
											style={{ fontSize: '24px' }}
											onClick={() => {
												setMoreButton(!moreButton)
											}}
										/>
									)}
								</div>
							)}

							<Button htmlType={'submit'} style={{ marginRight: '12px' }} type={'primary'}>
								搜索
							</Button>
							<Button
								onClick={() => {
									onReset?.()
								}}>
								重置
							</Button>
						</div>
					</Col>
				)
			}
		}
		if (!moreButton) {
			const filterData = columns.filter((filterItem, filterIndex) => {
				return filterIndex < index - 1
			})
			return [...filterData, pushData]
		} else {
			const list = [...columns]
			list.splice(index - 1, 0, pushData)
			return list
		}
	}

	function getDomWidth() {
		const divWidth = divRef.current.clientWidth
		const formItemAll = divRef.current?.querySelectorAll('.ant-form-item')
		let formItemWidth = 0
		const buttonWidth = 300
		let index = 0
		let isEnd = true
		for (const formItemAllElement of formItemAll) {
			formItemWidth += formItemAllElement.clientWidth
			index += 1
			if (divWidth < buttonWidth + formItemWidth) {
				isEnd = false
				break
			}
		}
		if (isEnd) {
			seSHowMore(false)
			index += 1
		} else {
			seSHowMore(true)
		}
		isInt.current = false
		moreIndex.current = index
		const dataList = setMoreButtonList()
		setColumnsData(dataList)
	}

	return (
		// @ts-ignore
		<div className={`search-consent ${isInt.current && !moreButton ? 'hide-height' : ''}`} style={{ width: '100%' }} ref={divRef}>
			<HtForm {...{ value, columns: columnsData, ...attrs }} colon={false} />
		</div>
	)
}

export default Search
