import React from 'react'

interface Actions {
  [key: string]: ActionCreator | Action
}

interface Action {
  [key: string]: any
}

type ActionCreator = (...args: any[]) => Action

type Reducer<S, A extends Actions> = (state: S, action: ReducerAction<A>) => Partial<S>

type Dispatch<A extends Actions> = React.Dispatch<ReducerAction<A>>

type ReducerAction<A extends Actions> = VerbalizedActions<A>[keyof A]

type UseReducer<S, A extends Actions> = (initial?: Partial<S>) => [S, MappedActions<A>, Dispatch<A>]

type UseContext<A extends Actions> = <C extends any>(initial?: C) => React.Context<C & MappedActions<A>>

type VerbalizedActions<A extends Actions> = {
  [K in keyof A]: (A[K] extends ActionCreator ? ReturnType<A[K]> : A[K]) & {
    type: K
  }
}

type MappedActions<A extends Actions> = {
  [K in keyof A]: (A[K] extends ActionCreator ? (...args: Parameters<A[K]>) => void : () => void)
}

export const verbalReducer = <S>(initialState?: S) => <A extends Actions>(actions: A, reducer: Reducer<S, A>) => {
  if (!React.useReducer) {
    throw new Error('This package requires React@16.8.6 or greater.')
  }

  if (typeof actions !== 'object') {
    throw new Error('Actions must be provided as an object.')
  }

  if (typeof reducer !== 'function') {
    throw new Error('Reducer must be provided as a function.')
  }

  if (Array.isArray(actions)) {
    throw new Error('Actions cannot be arrays, since their purpose is predicated on a key/value relationship.')
  }

  const use: UseReducer<S, A> = (initialComponentState?: Partial<S>) => {
    const [state, dispatch] = React.useReducer(
      (s, a) => {
        return { ...s, ...reducer(s, a) }
      },
      {
        ...initialState,
        ...initialComponentState,
      },
    )

    const mappedActions = React.useMemo(
      () =>
        Object.keys(actions).reduce(
          (mapped, type) => {
            const action = actions[type]
            return {
              ...mapped,
              [type]:
                typeof action === 'function'
                  ? (...args: any[]) => dispatch({ ...action(...args), type })
                  : () => dispatch({ ...(action as any), type }),
            }
          },
          {} as MappedActions<A>,
        ),
      [],
    )

    return [state, mappedActions, dispatch]
  }

  const useContext: UseContext<A> = (initial?) => {
    return React.createContext(initial)
  }

  return {
    use,
    useContext,
  }
}
