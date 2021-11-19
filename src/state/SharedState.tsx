import React from 'react';

/**
 * State setter
 */
type StateSetFunction<T> = (newValue: T) => void

/**
 * The return type of useState(); identical to React.useState()
 */
type StateResult<T> = [T, (newValue: T) => void]

/**
 * Custom useState function signature
 */
type CustomUseState<V> = () => StateResult<V>

function createSharedState<T>(prototype: T): { [K in keyof T]: CustomUseState<T[K]>} {
  const state: { [K in keyof T]: CustomUseState<T[K]>} = {} as any
  Object.keys(prototype).forEach((k: any) => (state as any)[k] = createStateManager((prototype as any)[k]))
  return state
}

function createStateManager<V>(initialValue: V): CustomUseState<V> {
  let value = initialValue
  let listeners: StateSetFunction<V>[] = []
  const propagate = (v: V) => {
    // Update actual state value
    value = v
    // Propagate change to all registered listeners
    listeners.forEach(l => l(v))
  }

  return () => {
    const [, setVal] = React.useState(value)
    React.useEffect(() => {
      // Track this new internal state value
      listeners.push(setVal)
      return () => {
        // Remove internal state tracking when the call to this custom useState is unmounted
        listeners.splice(listeners.findIndex(l => l === setVal), 1)
      }
    }, [setVal])
    return [value, propagate]
  }
}


export function createState<T>(initialState: T) {
  const state = createSharedState(initialState)
  const Context = React.createContext(state)

  const Provider: React.FC<{}> = ({children}) => (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  )

  return {
    Provider,
    useState: (name: keyof T) => React.useContext(Context)[name]()
  }
}
