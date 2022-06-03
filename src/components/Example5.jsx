import React from "react";

export default function Example5() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log("componentDidMount");

    return () => {
      // cleanup 공간 : 다음 렌더가 실행되기 직전에 여기 있는 것이 실행됨
      // componentWillUnmount의 역할을 한다.
    };
  }, []);

  // 중요!!!
  React.useEffect(() => {
    console.log("componentDidMount & componentDidUpdate by count", count);

    return () => {
      // cleanup 공간 : componentDidUpdate가 되기 직전에 정리하고 떠나는 공간
      console.log("cleanup by count", count);
    };
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={click}>Click me</button>
    </div>
  );

  function click() {
    setCount(count + 1);
  }
}
