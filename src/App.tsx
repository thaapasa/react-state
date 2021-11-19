import React from 'react';
import './App.css';
import { createState } from './state/SharedState';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container />
      </header>
    </div>
  );
}

const SharedState = createState({ a: "moi", b: "hei", c: "jepa" })

const Container: React.FC<{}> = () => {
  return (
    <SharedState.Provider>
      <A />
      <B />
      <C />
    </SharedState.Provider>
  )
}

const A: React.FC<{}> = () => {
  const [a, setA] = SharedState.useState("a")
  console.log("Render A", a)
  return <div>Client A: {a} <button onClick={() => setA(a + "!")}>Jeps</button></div>
}
const B: React.FC<{}> = () => {
  const [a] = SharedState.useState("a")
  const [b, setB] = SharedState.useState("b")
  console.log("Render B", a, b)
  return <div>Client B: {a}<br />{b} <button onClick={() => setB(b + "!")}>Jeps</button></div>
}
const C: React.FC<{}> = () => <div>Client C</div>

export default App;
