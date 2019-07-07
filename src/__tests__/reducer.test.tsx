import React from 'react'

import { shallow, ShallowWrapper } from 'enzyme'
import { verbalReducer } from '../'

interface State {
  arr: any[]
  str: string
}

const reducer = verbalReducer<State>()(
  {
    setArr: (arr: any[]) => ({
      arr,
    }),
    setArrElem: (elem: any) => ({
      elem,
    }),
    setStr: (str: string) => ({
      str,
    }),
  },
  (state, action) => {
    switch (action.type) {
      case 'setArr':
        return { arr: action.arr }
      case 'setArrElem':
        return { arr: state.arr.filter(({ id }) => id !== action.elem.id).concat(action.elem) }
      case 'setStr':
        return { str: action.str }
    }
  },
)

const Component: React.FunctionComponent = () => {
  const [state, actions] = reducer.use({
    arr: [{ id: 1 }, { id: 2 }],
    str: 'str',
  })

  return (
    <>
      <div id="str">{state.str}</div>

      <div id="arr">
        {state.arr.map((elem) => (
          <div key={elem.id} id={`elem_${elem.id}`} />
        ))}
      </div>

      <button id="button_insertElem" onClick={() => actions.setArrElem({ id: 3 })} />

      <button id="button_setArr" onClick={() => actions.setArr([])} />

      <button id="button_updateStr" onClick={() => actions.setStr('updated str')} />
    </>
  )
}

describe('Verbal reducer component test', () => {
  let component: ShallowWrapper<any>

  beforeAll(() => {
    component = shallow(<Component />)
  })

  it('Renders', () => {
    expect(component).toBeTruthy()
    expect(component.find('#arr').children()).toHaveLength(2)
    expect(component.find('#str').text()).toBe('str')
  })

  it('Accurately inerts array element', () => {
    expect(component.find('#elem_3')).toHaveLength(0)
    component.find('#button_insertElem').simulate('click')
    expect(component.find('#arr').children()).toHaveLength(3)
    expect(component.find('#elem_3')).toHaveLength(1)
  })

  it('Accurately updates arrayy', () => {
    expect(component.find('#arr').children()).toHaveLength(3)
    component.find('#button_setArr').simulate('click')
    expect(component.find('#arr').children()).toHaveLength(0)
  })

  it('Accuratesly updates str', () => {
    component.find('#button_updateStr').simulate('click')
    expect(
      component
        .update()
        .find('#str')
        .text(),
    ).toBe('updated str')
  })
})
