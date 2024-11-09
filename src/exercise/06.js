// useEffect: HTTP requests
// 💯 store the state in an object
// http://localhost:3000/isolated/final/06.extra-3.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
import { handlers } from './../backend';
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../pokemon'

//  --↓-- 这就是原生的reactErrorBoundary
// 一个state存储错误信息，一个方法更新错误信息，一个方法来渲染错误或者渲染子页面

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   // 这是一个 React 生命周期方法，当子组件抛出错误时，这个方法会被调用。
//   // 返回一个对象来更新组件的状态，使得错误信息可以存储在 state 中。
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   // 渲染逻辑
//   render() {
//     const {error} = this.state
//     if (error) {
//       return (
//         <div>
//           There was an error:{' '}
//           <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
//         </div>
//       )
//     }
//     // this.props -> 这个组件 .child -> 子组件
//     return this.props.children
//   }
// }
function ErrorFallBack({error, resetErrorBoundary}) {
  return (
    <div>
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onclick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}
function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon})
      },
      error => {
        setState({status: 'rejected', error})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  function handleReset(){
    setPokemonName('')
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallBack} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
