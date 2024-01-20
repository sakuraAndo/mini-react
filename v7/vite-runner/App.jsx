import React from "./core/React.js";

// let showBar = false;
// function Counter() {
//   // const foo = (
//   // <div>
//   //   foo
//   //   <div>child1</div>
//   //   <div>child2</div>
//   // </div>
//   // )
//   const bar = <div>bar</div>

//   function handleShowBar() {
//    showBar = !showBar 
//    React.update()
//   }

//   return (
//     <div>
//       Counter
//       {showBar && bar}
//       <button onClick={handleShowBar}>showBar</button>
//     </div>
//   )
// }



// function App() {
//   return (
//     <div>
//       hi-mini-react
//       <Counter></Counter>
//     </div>
//   );
// }

let countFoo = 1;
function Foo() {
  console.log('foo return');
  const update = React.update();
  function handleClick() {
    countFoo++;
    update();
  }
  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

let countBar = 1;
function Bar() {
  console.log('bar return');
  const update = React.update();
  function hanleBar() {
    countBar++;
    update();
  }
  return (
    <div>
      <h1>bar</h1>
    {countBar}
    <button onClick={hanleBar}>click</button>
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
      <Bar></Bar>
    </div>
  )
}


export default App;