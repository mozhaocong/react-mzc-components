import { deepClone } from 'html-mzc-tool'
import moment, { isMoment } from 'moment/moment'

export function dataMomentToTimeData(item: any): any {
	return deepClone(item, response => {
		if (isMoment(response)) {
			return moment(response).format('X')
		}
		return response
	})
}
