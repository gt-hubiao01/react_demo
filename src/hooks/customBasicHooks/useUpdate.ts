import { useReducer } from "react";

/**
 * 一个自定义的 Hook，返回一个更新函数。
 * 返回的函数可以被调用来触发组件的重新渲染。
 *
 * @returns {() => void} 更新函数。
 */
function useUpdate(): () => void {
  const [, update] = useReducer((num: number): number => num + 1, 0);

  return update;
}

export default useUpdate;
