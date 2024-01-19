import React from "./core/React.js";

let count = 1
function Counter({ num }) {
  function clickFunction() {
    count++
    console.log('click');
    React.update()
  }
  return (<div>count: {num}
       <button onClick={clickFunction}>点击</button>
       {count}
  </div>);

}


function CounterContainer() {
  return <Counter></Counter>;
}

function App() {
  return (
    <div>
      hi-mini-react
      <Counter num={10}></Counter>
      {/* <CounterContainer></CounterContainer> */}
    </div>
  );
}


export default App;
