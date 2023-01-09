import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { debounce, deepClone } from 'html-mzc-tool'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import HtForm from '../../Form'
import { _FormType } from '../../Form/indexType'

interface SearchType extends _FormType {
	loading: boolean
	fId: string
	onReset: any
}

const Search: React.FC<SearchType> = props => {
	const { value, columns, loading, fId, onReset, ...attrs } = props
	const [location, setLocation] = useState<number>(-1)
	const locationIndex = useRef<any>(-1)
	const [divHeight, setDivHeight] = useState(100)
	const formRef = useRef<any>()
	const [putAway, setPutAway] = useState(true)

	useEffect(() => {
		if (!formRef?.current) return
		function setTest() {
			const clientHeight = formRef?.current?.clientWidth || 0
			if (!clientHeight) return
			const allDiv = formRef?.current.querySelectorAll('.form-row>div')
			// @ts-ignore
			setDivHeight(allDiv[0].clientHeight + 'px')
			let divWidth = 200
			for (const index in allDiv) {
				// @ts-ignore
				if (locationIndex.current == index) {
					continue
				}
				divWidth += allDiv[index]?.clientWidth || 0
				if (clientHeight < divWidth) {
					let indexData = index
					if (index > locationIndex.current && locationIndex.current > 0) {
						// @ts-ignore
						indexData = index - 1
					}
					locationIndex.current = indexData
					// @ts-ignore
					setLocation(indexData)
					return
				}
			}
		}
		const debounceTest = debounce(setTest, 100)
		const resizeObserver = new ResizeObserver(() => {
			debounceTest()
		})
		// @ts-ignore
		const documentData = formRef?.current
		resizeObserver.observe(documentData)
		return () => {
			resizeObserver.unobserve(documentData)
		}
	}, [formRef])

	const columnsList = useMemo(() => {
		const data = deepClone(columns) || []
		data.splice(location, 0, {
			col: { flex: 'auto' },
			customRender: () => {
				return (
					<div style={{ justifyContent: 'flex-end', display: 'flex' }}>
						<div style={{ width: '200px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
							{putAway ? <DownOutlined onClick={() => setPutAway(false)} /> : <UpOutlined onClick={() => setPutAway(true)} />}
							<Button type={'primary'} loading={loading} htmlType={'submit'}>
								搜索
							</Button>
							<Button loading={loading} onClick={onReset}>
								重置
							</Button>
						</div>
					</div>
				)
			}
		})

		return data
	}, [location, columns, putAway])

	const searchStyle = useMemo<ObjectMap>(() => {
		if (putAway) {
			return { height: divHeight, overflow: 'hidden' }
		} else {
			return {}
		}
	}, [putAway, divHeight])
	return (
		<div ref={formRef} style={searchStyle}>
			<HtForm {...{ value, columns: columnsList, ...attrs }} />
		</div>
	)
}

export default Search
