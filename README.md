# React Verbal Reducer

Verbal reducers are extensions of the React `useEffect` hook. A verbal reducer automatically applies types to actions, and provides a mapped version of each action creator directly to the component.

This serves as an alternative to `dispatch`, and is especially useful within `context` providers.

___
## Install

```
npm i --save react-verbal-reducer
```

## Simple Example

```ts
import { verbalReducer } from 'react-verbal-reducer'

interface State {
  count: number
}

const reducer = verbalReducer<State>()(
  {
    set(count: number) {
      return { count }
    },
    increment: {},
    decrement: {},
  },

  (state, action) => {
    switch (action.type) {
      case 'set':
        return { count: action.count }
      case 'increment':
        return { count: state.count + 1 }
      case 'decrement':
        return { count: state.count - 1 }
    }
  },
)

function Counter() {
  const [state, actions] = reducer.use({
    count: 0,
  })

  return (
    <>
      Count: {state.count}
      <button onClick={() => actions.set(50)}>+50</button>
      <button onClick={actions.increment}>+</button>
      <button onClick={actions.decrement}>-</button>
    </>
  )
}
```
