import { InputNumber } from 'antd'
import { deepClone, isTrue } from 'html-mzc-tool'
import React from 'react'

import { getPurchaseDropDown, getSkuDropDown, getSpuDropDown } from '@/api/scm/settlementCenter'
import { BaseFormTableColumnsItem, FormSelect, HtForm, Input, SelectApiParams, SelectInputApi } from '@/components'
import { judgmentApiSuccess, objectExistNull } from '@/utils'

const { FormTable, setFormNameToValue } = HtForm

class TableColumns extends BaseFormTableColumnsItem {
  constructor() {
    super()
    this.setColumns([
      {
        title: '序号',
        render: (item) => {
          return this.serialNumber(item)
        },
      },
      {
        title: '单据类型',
        dataIndex: 'supplementOrderPurchaseType',
        render: (item) => {
          const { valueData, setValue, index } = item
          return (
            <FormSelect
              onChange={() => {
                const data = deepClone(valueData.value)
                data.supplementOrderPurchaseDtoList[index].businessId = undefined
                data.supplementOrderPurchaseDtoList[index].spu = undefined
                data.supplementOrderPurchaseDtoList[index].sku = undefined
                setValue(data)
              }}
              prop={'supplementOrderPurchaseType'}
            />
          )
        },
        rules: [{ required: true }],
      },
      {
        title: '单据号',
        dataIndex: 'businessId',
        render: (item) => {
          const { record, valueOtherData, valueData, index, setValue } = item
          return (
            <SelectInputApi
              // eslint-disable-next-line unicorn/prevent-abbreviations
              onChange={(e, option) => {
                const data: any = JSON.parse(JSON.stringify(option))
                console.log('valueData', valueData)
                const formData = setFormNameToValue(valueData.value, ['supplementOrderPurchaseDtoList', index], (item) => {
                  console.log(item)
                  item.businessName = data.label
                  return item
                })
                setValue(formData)
                valueOtherData.value[data.value] = data.label
              }}
              isReset={(value) => {
                return !isTrue(value)
              }}
              disabled={!record.supplementOrderPurchaseType}
              apiRequest={getPurchaseDropDown}
              callBack={(backItem) => {
                if (!judgmentApiSuccess(backItem)) return []
                return backItem?.data?.list?.map((response: ObjectMap) => {
                  return { value: response.businessId, label: response.businessNo }
                })
              }}
              setParams={(parameters) => {
                return { supplementOrderPurchaseType: record.supplementOrderPurchaseType, businessNo: parameters }
              }}
            />
          )
        },
        rules: [{ required: true }],
      },
      {
        title: 'SPU',
        dataIndex: 'spu',
        render: (item) => {
          const { record = {}, valueOtherData, value } = item
          console.log('render', value, record)
          const { supplementOrderPurchaseType, businessId } = record
          let businessNo = ''
          if (businessId) {
            businessNo = valueOtherData.value[businessId]
          }
          return (
            <SelectApiParams
              isReset={(parameters) => {
                return objectExistNull(parameters)
              }}
              apiRequest={getSpuDropDown}
              params={{ businessNo, supplementOrderPurchaseType }}
              callBack={(backItem) => {
                if (!judgmentApiSuccess(backItem)) return []
                return backItem?.data?.list?.map((response: ObjectMap) => {
                  return { value: response.spu, label: response.spu }
                })
              }}
              isUpdate={(parameters) => {
                return !objectExistNull(parameters)
              }}
            />
          )
        },
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        render: (item) => {
          const { record = {}, valueOtherData } = item
          const { supplementOrderPurchaseType, businessId } = record
          let businessNo = ''
          if (businessId) {
            businessNo = valueOtherData.value[businessId]
          }
          return (
            <SelectApiParams
              isReset={(parameters) => {
                return objectExistNull(parameters)
              }}
              apiRequest={getSkuDropDown}
              params={{ businessNo, supplementOrderPurchaseType }}
              callBack={(backItem) => {
                if (!judgmentApiSuccess(backItem)) return []
                return backItem?.data?.list?.map((response: ObjectMap) => {
                  return { value: response.sku, label: response.sku }
                })
              }}
              isUpdate={(parameters) => {
                return !objectExistNull(parameters)
              }}
            />
          )
        },
      },
      { title: '数量', dataIndex: 'skuNum', render: () => <InputNumber /> },
      { title: '补款金额', dataIndex: 'supplementPrice', render: () => <Input />, rules: [{ required: true }] },
      { title: '补款描述', dataIndex: 'supplementRemarks', render: () => <Input />, rules: [{ required: true }] },
      {
        title: '操作',
        render: (item) => {
          return this.actionButton(item, 'supplementOrderPurchaseDtoList')
        },
      },
    ])
  }
}

const View: React.FC<any> = (item: any) => {
  return <FormTable isForm={false} formName={'supplementOrderPurchaseDtoList'} {...item} columns={new TableColumns().data} />
}

export default React.memo(View)
