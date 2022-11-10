import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { isTrue } from 'html-mzc-tool'
import React, { forwardRef, useEffect, useState } from 'react'

type valueType = string | number

interface callBack {
  value: valueType
  label: valueType
  [index: string]: any
}
interface propertiesType extends Omit<SelectProps, 'options'> {
  apiRequest: (item: ObjectMap) => Promise<any>
  params: ObjectMap
  callBack: (item: ObjectMap) => callBack[]
  isUpdate?: (parameters: any) => Boolean
  isReset?: (parameters: any) => Boolean
}

// eslint-disable-next-line react/display-name
const View: React.FC<propertiesType> = forwardRef((properties: propertiesType, reference) => {
  const { apiRequest, params, callBack, isUpdate, isReset, ...attributes } = properties
  const [options, setOptions] = useState<callBack[]>([])
  const [parametersData, setParametersData] = useState<ObjectMap>({})
  async function getApi(): Promise<void> {
    const data = await apiRequest(params)
    setParametersData(params)
    setOptions(callBack(data) || [])
  }
  useEffect(() => {
    if (isReset?.(params)) {
      if (!isTrue(options)) {
        return
      }
      setParametersData({})
      setOptions([])
      return
    }
    if (JSON.stringify(params) === JSON.stringify(parametersData)) return
    if (isUpdate && !isUpdate(params)) {
      return
    }
    void getApi()
  }, [apiRequest, params, callBack, isReset])
  // @ts-expect-error
  return <Select ref={reference} {...{ style: { width: '100%' }, ...attributes, options }} />
})

export default React.memo(View)
