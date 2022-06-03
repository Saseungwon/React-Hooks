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
