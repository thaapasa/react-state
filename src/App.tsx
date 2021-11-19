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
  const [shown, setShown] = React.useState(true)
  return (
    <SharedState.Provider>
      <button onClick={() => setShown(!shown)}>{shown ? "Piilota" : "Näytä"}</button>
      {shown ? (<>
        <A />
        <B />
        <C />
      </>): null}
    </SharedState.Provider>
  )
}

function useLogMounting(title: string) {
  React.useEffect(() => {
    console.log(`Mounted ${title}`)
    return () => {
      console.log(`Unmounted ${title}`)
    }
  // eslint-disable-next-line
  }, [])
}

const A: React.FC<{}> = () => {
  const [a, setA] = SharedState.useState("a")
  console.log("Render A", a)
  useLogMounting("A")
  return <div>Client A: {a} <button onClick={() => setA(a + "!")}>Jeps</button></div>
}
const B: React.FC<{}> = () => {
  const [a] = SharedState.useState("a")
  const [b, setB] = SharedState.useState("b")
  console.log("Render B", a, b)
  useLogMounting("B")
  return <div>Client B: {a}<br />{b} <button onClick={() => setB(b + "!")}>Jeps</button></div>
}
const C: React.FC<{}> = () => {
  console.log("Render C")
  useLogMounting("C")
  return <div>Client C</div>
}

export default App;
