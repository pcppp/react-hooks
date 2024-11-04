// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  defaltValue,
  // 这涉及到两个默认值 ->
  // 如果传入了第三个参数：从第三个参数中寻找serialize和deserialize这两个属性，
  //                    并为这两个属性设置默认值
  // 如果没有传入第三个参数：将第三个参数默认为空对象，然后再进行结构赋值，
  //                      因为是空对象，所以serialize和de还是默认值没有被覆盖
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInlocalStorage = window.localStorage.getItem(key)
    if (valueInlocalStorage) {
      return deserialize(valueInlocalStorage)
    }
    return typeof defaltValue === 'function' ? defaltValue() : defaltValue
  })
  // 尽管 useLocalStorage 本身会被重新执行，但 React 钩子有一个特性：它们能够保持状态。
  // 在 useLocalStorage 中使用的 useState 钩子确保即使 useLocalStorage 被重新调用，
  // 之前的状态（如从 localStorage 中获取的值）依然会被保留，只要其 key 参数未更改。
  const preKeyRef = React.useRef(key)
  React.useEffect(() => {
    const preKey = preKeyRef.current
    if (preKey !== key) {
      window.localStorage.removeItem(preKey)
    }
    preKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
    // 这里的改变依赖于key和state，所以第二个参数必须附带这两个依赖
  }, [serialize, state, key])
  return [state, setState]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  const [name, setName] = useLocalStorage('name', initialName)
  // 🐨 Here's where you'll use `React. useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
