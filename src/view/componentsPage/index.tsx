import { Button, Card, Divider } from 'antd'
import React, { useState } from 'react'

import { FormBasic, FormRadio, FormSelect, Timeline } from '@/components'

const View = () => {
	const [reverse, setReverse] = useState(false)

	return (
		<div>
			<Card title='Timeline'>
				<Timeline
					reverse={reverse}
					value={[
						{ title: '待确认', person: 'admin', time: '2022-10-30 20:30:30' },
						{
							title: '待审核',
							person: '周嘉敏',
							time: '2022-10-30 20:30:30',
							content: '审核拒绝原因：价格不合理'
						},
						{
							title: '待审核',
							person: '周嘉敏',
							time: '2022-10-30 20:30:30',
							content: '审核拒绝原因：价格不合理'
						}
					]}
				/>
				<Button
					onClick={() => {
						setReverse(!reverse)
					}}>
					reverse
				</Button>
			</Card>
			<Divider />
			<Card title='FormBasic'>
				<FormBasic prop={'basicSysUserList'} />
				<Divider />
				<FormBasic prop={'basicSysUserList'} />
			</Card>
			<Card title='FormSelect'>
				<FormSelect prop={'baseStatus'} />
			</Card>
			<Card title='FormRadio'>
				<FormRadio prop={'baseStatus'} />
			</Card>
		</div>
	)
}
export default View
