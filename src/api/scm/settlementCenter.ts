import { axiosPost } from 'html-mzc-tool'

type axiosPostType = (item: ObjectMap) => Promise<any>
const url = 'http://supply-gateway-dev.htwig.com'

export const searchSupplementOrder: axiosPostType = (item) => {
  return axiosPost(url + '/scm/supplementOrder/searchSupplementOrder', item)
}

export const getSupplementOrderDetail: axiosPostType = (item) => {
  item = {
    supplementOrderId: '1589526240077475842',
    version: 1,
  }
  return axiosPost(url + '/scm/supplementOrder/getSupplementOrderDetail', item)
}

export const searchDeductOrder: axiosPostType = async (item) => {
  return await axiosPost(url + '/scm/deductOrder/searchDeductOrder', item)
}

export const addSupplementOrder: axiosPostType = async (item) => {
  return await axiosPost(url + '/scm/supplementOrder/addSupplementOrder', item)
}

export const getPurchaseDropDown: axiosPostType = async (item) => {
  return await axiosPost(url + '/scm/supplementOrder/getPurchaseDropDown', item)
}

export const getSkuDropDown: axiosPostType = async (item) => {
  return await axiosPost(url + '/scm/supplementOrder/getSkuDropDown', item)
}

export const getSpuDropDown: axiosPostType = async (item) => {
  return await axiosPost(url + '/scm/supplementOrder/getSpuDropDown', item)
}
