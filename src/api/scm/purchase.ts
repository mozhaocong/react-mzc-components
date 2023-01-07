// import { axiosPost } from 'html-mzc-tool'

type axiosPostType = (item: ObjectMap) => Promise<any>
// const url = 'https://portal.admin.htwig.com/order/api'
export const searchPurchase: axiosPostType = async item => {
	console.log('item', item)
	return await new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ data: { data: [], total: 900, per_page: 50, current: 1 }, code: 200 })
		}, 1000)
	})
	// return await axiosPost(url + '/scm/scm/purchase/searchPurchase', item)
}
