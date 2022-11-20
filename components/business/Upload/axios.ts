import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const config = {}
class RequestHttp {
	service: AxiosInstance
	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config)
		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: AxiosRequestConfig) => {
				// 将当前请求添加到 pending 中
				// axiosCanceler.addPending(config)

				return { ...config, headers: { ...config.headers } }
			},
			async (error: AxiosError) => {
				throw error
			}
		)

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				return response
				// 在请求结束后，移除本次请求(关闭loading)
				// axiosCanceler.removePending(config)
			},
			// eslint-disable-next-line n/handle-callback-err
			async (error: AxiosError) => {}
		)
	}
}

const request = new RequestHttp(config).service

export default request.post
