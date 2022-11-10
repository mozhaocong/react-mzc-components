import produce from 'immer'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useSetState<S extends object>(initalState: S | (() => S)): [S, (state: Partial<S> | ((state: S) => Partial<S>)) => void] {
  const [_state, _setState] = useState<S>(initalState)

  const setState = useCallback((state: Partial<S> | ((state: S) => Partial<S>)) => {
    _setState((previous: S) => {
      let nextState = state
      if (typeof state === 'function') {
        nextState = state(previous)
      }

      return { ...previous, ...nextState }
    })
  }, [])

  return [_state, setState]
}

export function useForceUpdate(): () => void {
  const [, setValue] = useState(0)
  return useCallback(() => {
    // 递增state值，强制React进行重新渲染
    setValue((value) => (value + 1) % (Number.MAX_SAFE_INTEGER - 1))
  }, [])
}

export function useImmer(initialValue: any): any[] {
  const [value, updateValue] = useState(initialValue)
  return [
    value,
    useCallback((updater: any) => {
      updateValue(produce(updater))
    }, []),
  ]
}

export function usePrevious(value: any): any {
  const reference = useRef()
  // useEffect会在完成这次'渲染'之后执行
  useEffect(() => {
    reference.current = value
  })
  return reference.current
}

export function useReferenceProperties<T>(properties: T): any {
  const reference = useRef<T>(properties)
  // 每次重新渲染设置值
  reference.current = properties

  return reference
}

export function useOnUpdate(function_: () => void, dep?: any[]): void {
  const reference = useRef({ fn: function_, mounted: false })
  reference.current.fn = function_

  useEffect(() => {
    // 首次渲染不执行
    if (!reference.current.mounted) {
      reference.current.mounted = true
    } else {
      reference.current.fn()
    }
  }, dep)
}
