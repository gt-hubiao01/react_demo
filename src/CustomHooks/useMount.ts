import { useEffect } from "react";

/**
 * 自定义钩子，仅在组件挂载时运行提供的函数一次。
 *
 * @param fn - 组件挂载时要执行的函数。
 */
const useMount = (fn: () => void) => {
  useEffect(() => {
    fn?.();
  }, []);
};

export default useMount;