export const purchaseObject = {
	purchaseOrderStatus: {
		WAIT_ORDER: '待下单',
		WAIT_APPROVE: '待审核',
		WAIT_CONFIRM: '待确认',
		WAIT_RECEIVE_ORDER: '待接单',
		WAIT_SCHEDULING: '待排产',
		WAIT_COMMISSIONING: '待投产',
		COMMISSION: '已投产',
		PRETREATMENT: '前处理',
		SEWING: '缝制中',
		AFTER_TREATMENT: '后处理',
		POST_QC: '后整质检中',
		WAIT_DELIVER: '待发货',
		WAIT_RECEIPT: '待收货',
		RETURN: '已退货',
		WAIT_QC: '待质检',
		WAIT_WAREHOUSING: '待入库',
		WAREHOUSED: '已入库'
	} as const,

	purchaseSplitType: {
		1: '大货采购',
		2: '加工采购'
	},
	purchaseDevelopmentType: {
		1: '全新开款',
		2: '老款衍生',
		3: '本款优化',
		4: '新开SKU'
	},
	purchaseDiscountType: {
		PROVIDE_RAW: '我方提供原料',
		NO_DISCOUNT: '无折扣'
	}
}

type dataType = typeof purchaseObject.purchaseOrderStatus

export type purchaseOrderStatusKey = keyof dataType
export type purchaseOrderStatusLabel = {
	[k in keyof dataType]: dataType[k]
}[keyof dataType]
