// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js
import {useState} from 'react'
import * as React from 'react'

function useLocalStorage(
  key,
  defaltValue,
  {serfai = JSON.stringify, deserfai = JSON.parse} = {},
) {
  const [value, setValue] = useState(() => {
    const localValue = deserfai(window.localStorage.getItem(key))
    return localValue ? localValue : defaltValue
  })
  const preKeyRef = React.useRef(key)
  React.useEffect(() => {
    const preKey = preKeyRef.current
    if (preKey !== key) {
      window.localStorage.removeItem(preKey)
    }
    preKeyRef.current = key
    window.localStorage.setItem(key, serfai(value))
    // 这里的改变依赖于key和state，所以第二个参数必须附带这两个依赖
  }, [key, serfai, value])
  return [value, setValue]
}

function Game() {
  const [squares, setSquares] = useLocalStorage('squares', Array(9).fill(null))
  const [history, setHistory] = useLocalStorage('history', [
    Array(9).fill(null),
  ])
  const [currentStep, setCurrentStep] = useLocalStorage('currentStep', 0)
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)
  const historyStep = history.map((item, index) => (
    <li key={index}>
      <button
        disabled={currentStep !== index ? false : true}
        onClick={() => toHistory(index)}
      >
        {`go to move # ${index} ${currentStep === index ? 'current' : ''}`}
      </button>
    </li>
  ))
  function toHistory(step) {
    setCurrentStep(step)
    setSquares(history[step])
  }
  function restart() {
    setCurrentStep(0)
    setSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
  }
  function selectSquare(square) {
    const squaresCopy = [...squares]
    if (squaresCopy[square] || winner) {
      return
    } else {
      squaresCopy[square] = nextValue
      setSquares(squaresCopy)
      setCurrentStep(currentStep + 1)
      setHistory([...history.slice(0, currentStep + 1), [...squares]])
    }
  }
  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <Board selectSquare={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <ul>{historyStep}</ul>
    </div>
  )
}
function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
