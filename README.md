# React Verbal Reducer

Verbal reducers are extensions of the [React useEffect](https://reactjs.org/docs/hooks-reference.html#usereducer) hook. A verbal reducer automatically applies types to actions, and provides a mapped version of each action creator directly to the component.

This serves as an alternative to `dispatch`, and is especially useful within `context` providers.

# Install

```
npm i --save react-verbal-reducer
```

## Simple Example

```ts
import { verbalReducer } from 'react-verbal-reducer'

const initialState = {count: 0}

const reducer = verbalReducer(initialState)(
  {
    set: (count = 0) => ({
      count
    }),
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
  const [state, actions] = reducer.use()
  return (
    <>
      Count: {state.count}
      <button onClick={() => actions.set(state.count + 50)}>+50</button>
      <button onClick={actions.increment}>+</button>
      <button onClick={actions.decrement}>-</button>
      <button onClick={actions.set}>Reset</button>
    </>
  )
}
```
# Usage

The core purpose of verbal reducers is to provide mapped actions directly to the component in place of React `dispatch`. Just like dispatch, actions are guarenteed have a stable function identity.

## The Reducer

The reducers, actions and (optional) default state are all defined by means of the `verbalReducer` function. 

Unlike regular reducers, the update object returned verbal reducers gets *merged* as oposed to *set* (similar to the class component `setState` method).

```ts
const reducer = verbalReducer({ username: '', count: 0 })(
  {
    setUsername: (username: string) => ({
      username
    })
  },
  (state, action) => {
    switch (action.type) {
      case 'setUsername':
         // results in { username: action.username, count: 0 }
        return { username: action.username }
    }
  }
)
```

### Typed State

In the above example, the Typescript compiler will interpret the state type directly from the default definition. This could be problematic for initial state values derived from props. So, you can also apply a state type directly.

```ts
interface State {
  username: string
  count: number
}

const reducer = verbalReducer<State>({ username: 'guest' })(
  ...
)
```

You can then supply default state values within the component:

```ts
function Counter(props) {
  const [state, { setUsername, setCount }] = reducer.use({
    count: props.count,
  })
}
```

*Note*: The above example also demonstrates how to deconstruct the actions and access them directly. This is usefull when you don't have a need to use the entire actions object itself.