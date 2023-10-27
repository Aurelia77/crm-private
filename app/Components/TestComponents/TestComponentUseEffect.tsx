'use client'

import React from 'react'

export default function TestComponentUseEffect() {
  const [counter, setCounter] = React.useState(0)
  const [items, setItems] = React.useState([])

  const incrementCounter = () => {
    setCounter(prevCounter => prevCounter + 1)
  }

  React.useEffect(() => {
    console.log(`Synchronize: ${counter}`)
    //setItems(prevItems => [...prevItems, {count: counter, type: 'synchronize'}])

    return () => {
      console.log(`%cCleanup: ${counter}`, 'color: blue')
      //setItems(prevItems => [...prevItems, {count: counter, type: 'cleanup'}])
    } 
  }
  , [counter])

  return (
    <div>
      <h3>Counter : {counter}</h3>
      <input type='button' onClick={incrementCounter} value="Increment counter" />
      <h3>Items</h3>
      <ul>
        {/* {items.map((item, index) => <li key={index}>{item.count} - {item.type}</li>)} */}
      </ul>

    </div>
  )
}
