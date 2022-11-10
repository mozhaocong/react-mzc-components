export const settleCenterObject = {
  settleCenterStatus: {
    WAIT_SUBMIT: '待提交',
    WAIT_APPROVE: '待审核',
    WAIT_CONFIRM: '待确认',
    WAIT_SETTLE: '待核算',
    WAIT_EXAMINE: '结算待审核',
    AUDITED: '已审核',
    PART_SETTLE: '部分结算',
    SETTLE: '已结算',
  } as const,
  supplementType: {
    PRICE: '价差补款',
    PROCESS: '加工补款',
  },
  supplementOrderPurchaseType: {
    CARGO: '大货采购单',
    PROCESS: '加工采购单',
    RETURN_GOODS: '退货单',
    SAMPLE_GOODS: '样品单',
  },
}

type dataType = typeof settleCenterObject.settleCenterStatus
export type settleCenterStatusKey = keyof dataType
export type settleCenterStatusLabel = {
  [k in keyof dataType]: dataType[k]
}[keyof dataType]
