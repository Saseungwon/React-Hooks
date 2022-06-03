## Hooks & Context

### Basic Hooks

Class Component에서 state를 잘 사용하고 있었는데
UseState가 나타나서 Function Component에서 상태를 처리하려고 하는 이유

- 컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어렵다, 컨테이너 방식 말고 상태와 관련된 로직
- 복잡한 컴포넌트들은 이해하기 어렵다.
- Class는 사람과 기계를 혼동시킨다. 컴파일 단계에서 코드를 최적화하기 어렵게 만든다.
- this.state는 로직에서 레퍼런스를 공유하기 때문에 문제가 발생할 수 있다.

**같은 기능을 여러 방식으로 비교**

#### Class Component

Example1.jsx

```jsx
import React from "react";

export default class Example1 extends React.Component {
  state = {
    count: 0,
  };

  render() {
    const { count } = this.state;

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={this.click}>Click me</button>
      </div>
    );
  }

  click = () => {
    this.setState({ count: this.state.count + 1 });
  };
}
```

#### Function Component

Example2.jsx

```jsx
import React from "react";

export default function Example2() {
  const [count, setCount] = React.useState(0);

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
```

#### Function Component (의존적이지 않게)

Example3.jsx

```jsx
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
```

<br>

#### useEffect (중요!!)

- useState : state를 대체할 수 있다.
- useEffect : 라이프사이클 훅을 대체할 수 있다.
  - componentDidMount
  - componentDidUpdate
  - ComponentWillUnmount

Example5.jsx

```jsx
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
```

## Custom Hook

명명 : useSomething
hook은 hook 또는 함수 컴포넌트 안에서만 실행 가능

#### 브라우저 가로창 사이즈가 변경되었을 때 그 사이즈를 가져오는 훅

useWindowWidth.js

```jsx
import { useEffect, useState } from "react";

export default function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth); // 현재 상태의 가로값 가져옴

  useEffect(() => {
    const resize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", resize);

    return () => {
      // cleanup
      window.removeEventListener("resize", resize);
    };
  }, []); // 빈배열은 componentDidMount 일때만 처리되는 것

  return width;
}
```

<br>

## Additional Hook (리액트 제공 훅)

#### useReducer

- useState의 확장판
- 다수의 하위값을 포함하는 복잡한 정적 로직을 만드는 경우
- 다음 state가 이전 state에 의존하는 경우
- Redux를 안다면 쉽게 사용 가능

useReducer를 사용해서 상태 변경하기

```jsx
import { useReducer } from "react";

// reducer => state를 변경하는 로직이 담겨있는 함수
const reducer = (state, action) => {
  if (action.type === "PLUS") {
    return {
      count: state.count + 1,
    };
  }
  return state;
};

// dispatch => action 객체를 넣어서 실행

// action => 객체이고 필수 프로퍼티로 type을 가진다.

export default function Example6() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <p>You clicked {state.count} times</p>
      <button onClick={click}>Click me</button>
    </div>
  );

  function click() {
    dispatch({ type: "PLUS" });
  }
}
```

#### useMemo & useCallback

```jsx
import { useCallback, useMemo, useState } from "react";

function sum(persons) {
  console.log("sum...");
  return persons.map((person) => person.age).reduce((l, r) => l + r, 0);
}

export default function Example7() {
  const [value, setValue] = useState("");
  const [persons] = useState([
    { name: "Mark", age: 39 },
    { name: "Seungwon", age: 28 },
  ]);

  const count = useMemo(() => {
    return sum(persons);
  }, [persons]);

  // useCallback 중요! : 어떤 함수를 [] 안에 있는 조건에 맞춰서 새로 만들어서 할당해서 사용하는 것
  const click = useCallback(() => {
    console.log(value);
  }, []);

  return (
    <div>
      <input value={value} onChange={change} />
      <p>{count}</p>
      <button onClick={click}>클릭</button>
    </div>
  );

  function change(e) {
    setValue(e.target.value);
  }
}
```

#### useRef

```jsx
import { useState, createRef, useRef } from "react";

export default function Example8() {
  const [value, setValue] = useState("");
  const input1Ref = createRef();
  const input2Ref = useRef();

  console.log(input1Ref.current, input2Ref.current);

  return (
    <div>
      <input value={value} onChange={change} />
      <input ref={input1Ref} />
      <input ref={input2Ref} />
    </div>
  );

  function change(e) {
    setValue(e.target.value);
  }
}
```
