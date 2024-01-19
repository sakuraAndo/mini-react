import React from './core/React.js';

// const App = React.createElement('div', { id: 'app' }, 'sdf-', 'xxx');

function CountContainr() {
    return <Count num = {1}></Count>
}

function Count({num}) {
    return <div>count: {num}</div>;
  }
  
//   const App = <div>hi-mini-react<div>lalala</div><Count num={1}></Count><Count num={2}></Count></div>

function App() {
    return (
        <div>
            hi-mini-react
            <Count num={1}></Count>
            <Count num={2}></Count>
        </div>
    )
}

//   function App() {
//     return (
//       <div>
//         hi-mini-react
//         <Counter num={10}></Counter>
//         <Counter num={20}></Counter>
//         {/* <CounterContainer></CounterContainer> */}
//       </div>
//     );
//   }

// console.log(App);

export default App;
// import React from "./core/React.js";

// function Counter({ num }) {
//   return <div>count: {num}</div>;
// }


// function CounterContainer() {
//   return <Counter></Counter>;
// }

// function App() {
//   return (
//     <div>
//       hi-mini-react
//       <Counter num={10}></Counter>
//       <Counter num={20}></Counter>
//       {/* <CounterContainer></CounterContainer> */}
//     </div>
//   );
// }


// export default App;
