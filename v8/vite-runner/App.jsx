import React from "./core/React.js";


function Foo() {
  console.log('foo return');
  // const update = React.update();
  const [count, setCount] = React.useState(3);
  const [bar, setBar] = React.useState('bar')
  function handleClick() {
    // setCount((s)=> s+1)
    setBar('basr')
  }
  return (
    <div>
      <h1>foo</h1>
      {count}
      <div>
        {bar}
      </div>
      <button onClick={handleClick}>click</button>
    </div>
  )
}


let countRoot = 1;
function App() {
  console.log('app return');

  let update = React.update();
  function handleClick() {
    countRoot++;
    update();
  };


  return (
    <div>
      hi-mini-react count:{countRoot}
      <button onClick={handleClick}>click</button>
      <Foo></Foo>
    </div>
  )
}


export default App;