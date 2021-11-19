import React from 'react';
import { createSharedState } from './State';

export function createState<T>(initialState: T) {
  const state = createSharedState(initialState)
  const Context = React.createContext(state)

  const Provider: React.FC<{}> = ({children}) => <Context.Provider value={state}>{children}</Context.Provider>

  return {
    Provider,
    useState: (name: keyof T) => React.useContext(Context)[name].useState()
  }
}
