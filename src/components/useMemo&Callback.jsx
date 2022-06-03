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
