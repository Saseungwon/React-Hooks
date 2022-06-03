import React from "react";

// useState => count
// useState => {count:0};
export default function Example3() {
  const [state, setState] = React.useState({ count: 0 });

  return (
    <div>
      <p>You clicked {state.count} times</p>
      <button onClick={click}>Click me</button>
    </div>
  );

  function click() {
    // state가 내부에서 변경되어 의존적이지 않도록 만들기
    // 아래 코드 생략 : setState((state) => ({ count: state.count + 1 }));
    setState((state) => {
      return {
        count: state.count + 1,
      };
    });
  }
}
