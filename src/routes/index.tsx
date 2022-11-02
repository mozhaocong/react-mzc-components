import layout from '@/layout'

// @ts-ignore
const context = require.context('../view', true, /^\.\/.*$/)
// /index\.tsx$/
context.keys()
// 通过遍历数组加载模块
export const mapRouter = {}
context.keys().forEach(filename => {
	// console.log(filename)
	const data = filename.split('/')
	if (data.length === 2) {
		mapRouter[filename.replace('./', '')] = context(filename)
	}
})

const routes: any = [
	{
		path: '/',
		component: layout,
		children: []
	}
]
for (const mapKey in mapRouter) {
	const childrenRoutes = { path: mapKey, component: mapRouter[mapKey].default }
	routes[0].children.push(childrenRoutes)
}
export default routes

// import { lazy } from 'react'
//
// import testForm from '@/view/testForm'
// import testFormList from '@/view/testFormList'
// import testFormAddFormList from '@/view/testFormAddFormList'
// import Load from './teddst'
//
// // function testData(item): any {
// // 	return new Promise(resolve => {
// // 		resolve({ default: item })
// // 	})
// // }
//
// // @ts-ignore
// // const TestForm = lazy(() => testData(testForm))
// // // const TestForm = Load(() => require('@/view/testForm'))
// // const PageSearchTable = lazy(() => testData(testFormList))
// // const TestModal = lazy(() => testData(testFormAddFormList))
//
// const TestForm = lazy(() => import('@/view/testForm'))
// // const TestForm = Load(() => require('@/view/testForm'))
// const PageSearchTable = lazy(() => import('@/view/pageSearchTable'))
// const TestModal = lazy(() => import('@/view/testFormSelect'))
//
// // import testFormTable from '@/view/testFormTable'
// // import testModal from '@/view/testModal'
// // import pageSearchTable from '@/view/pageSearchTable'
// // import testFormSelect from '@/view/testFormSelect'
// // import pageSplitOrder from '@/view/pageSplitOrder'
// // import componentsPage from '@/view/componentsPage'
// // import testReducer from '@/view/testReducer'
// // import testFormBasicData from '@/view/testFormBasicData'
//
// export const mapRouter = { pageSearchTable: 1, testModal: 1, testForm: 1 }
//
// const routes: any = [
// 	{
// 		path: '/',
// 		component: layout,
// 		children: [
// 			{
// 				path: 'pageSearchTable',
// 				component: PageSearchTable
// 			},
// 			{
// 				path: 'testModal',
// 				component: TestModal
// 			},
// 			{
// 				path: 'testForm',
// 				component: TestForm
// 			}
// 			// {
// 			// 	path: 'testFormAddFormList',
// 			// 	component: testFormAddFormList
// 			// },
// 			// {
// 			// 	path: 'testFormList',
// 			// 	component: testFormList
// 			// },
// 			// {
// 			// 	path: 'testFormTable',
// 			// 	component: testFormTable
// 			// },
// 			// {
// 			// 	path: 'testFormSelect',
// 			// 	component: testFormSelect
// 			// },
// 			// {
// 			// 	path: 'pageSplitOrder',
// 			// 	component: pageSplitOrder
// 			// },
// 			// {
// 			// 	path: 'componentsPage',
// 			// 	component: componentsPage
// 			// },
// 			// {
// 			// 	path: 'formBasicData',
// 			// 	component: testFormBasicData
// 			// },
// 			// {
// 			// 	path: 'testReducer',
// 			// 	component: testReducer
// 			// }
// 		]
// 	}
// ]
// export default routes
