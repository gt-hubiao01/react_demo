import { useEffect } from "react";
import useLatest from "./useLatest";

/**
 * 在组件卸载时执行回调函数。
 * @param {() => void} fn - 在卸载时要执行的回调函数。
 */
const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    []
  );
};

export default useUnmount;