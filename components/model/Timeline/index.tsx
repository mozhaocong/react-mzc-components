import './index.less'

import { Timeline } from '@components/antd'
import { TimelineProps } from 'antd/lib/timeline/Timeline'
import { isTrue } from 'html-mzc-tool'
import React, { CSSProperties } from 'react'
interface timelineProps extends TimelineProps {
	value: { title: string; time: string; person: string; content?: string }[]
	style?: CSSProperties
}

const View = (props: timelineProps) => {
	const { style = {} } = props

	const timeContentStyle = {
		fontSize: '12px',
		color: '#646566',
		lineHeight: '22px'
	}
	return (
		<Timeline
			style={{
				width: '300px',
				...style
			}}>
			{props.value.map((item, index) => {
				const { title, person, time, content } = item
				return (
					<Timeline.Item key={index}>
						<div>
							<div style={{ fontSize: '14px', fontWeight: '500' }}>
								<span style={{ color: '#262626' }}>{title}</span>
								<span style={{ color: '#186D5A' }}>【{person}】</span>
							</div>
							<div style={timeContentStyle}>{time}</div>
							{isTrue(content) && <div style={timeContentStyle}>{content}</div>}
						</div>
					</Timeline.Item>
				)
			})}
		</Timeline>
	)
}
export default React.memo(View)
