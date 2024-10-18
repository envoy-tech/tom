import { useState, useLayoutEffect } from "react";

type ElementSize = {
  width: number | null;
  height: number | null;
};

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ElementSize>({
    width: null,
    height: null,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
