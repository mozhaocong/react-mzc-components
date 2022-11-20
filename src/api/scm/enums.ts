import { axiosPost } from 'html-mzc-tool'

type requestType = (item: ObjectMap) => Promise<any>
const url = 'http://supply-gateway-dev.htwig.com'
export const getScmEnums: requestType = async item => {
	return await axiosPost(url + '/scm/enums/getEnums', item)
}

// enumNameList: ['DeductType'],
//   enumNameList: ['SupplementOrderPurchaseType'],
