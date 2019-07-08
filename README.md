# React Verbal Reducer

This package provides an extention to the React `useEffect` hook. A verbal reducer automatically applies types to reducer actions, and provides a mapped version of each action creator directly to the component.

Using verbal reducers relieves developers of the need to create overly verbose and (often times) ambiguous reducer boiler plate. Written in Typescript, verbal reducers will automatically interpret the action types and corresponding actions being provided within reducers, and exposed within components.

___
## Install

```
npm i --save react-verbal-reducer
```

## Simple Example

```ts
import { verbalReducer } from 'react-verbal-reducer'

interface State {
  isLoading: boolean
  users: User[]
}

const reducer = verbalReducer<State>()(
  {
    setIsLoading: (isLoading: boolean) => ({
      isLoading,
    }),
    
    setUsers: (users: User[]) => ({
      users,
    }),
  },

  (state, action) => {
    switch (action.type) {
      case 'setIsLoading':
        return { isLoading: action.isLoading }
      case 'setUsers':
        return { isLoading: false, users: action.users }
    }
  },
)

const Component = () => {
  const [state, { setIsLoading, setUsers }] = reducer.use({
    isLoading: false,
    users: [],
  })

  const loadUsers = () => {
    setIsLoading(true)

    Promise.resolve(apiCall()).then((users) => {
      setUsers(users)
    })
  }
})
```
