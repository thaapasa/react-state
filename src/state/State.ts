import * as React from "react"

type NotifyFun<T> = (newValue: T) => void

type StateResult<T> = [T, (newValue: T) => void]

interface StateManager<V> {
  current: V
  useState: () => StateResult<V>
}

export function createSharedState<T>(prototype: T): { [K in keyof T]: StateManager<T[K]>} {
  const state: { [K in keyof T]: StateManager<T[K]>} = {} as any
  Object.keys(prototype).forEach((k: any) => (state as any)[k] = createStateManager((prototype as any)[k]))
  return state
}

function createStateManager<V>(initialValue: V): StateManager<V> {
  let value = initialValue
  let listeners: NotifyFun<V>[] = []
  const propagate = (v: V) => listeners.forEach(l => l(v))
  return {
    current: initialValue,
    useState: () => {
      const [val, setVal] = React.useState(value)
      React.useEffect(() => {
        // Track this new internal state value
        listeners.push(setVal)
        return () => {
          // Remove internal state tracking when the call to this custom useState is unmounted
          listeners.splice(listeners.findIndex(l => l === setVal), 1)
        }
      }, [setVal])
      return [val, propagate]
    }
  }
}