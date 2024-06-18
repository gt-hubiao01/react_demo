import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import useUnmountedRef from "./useUnmountedRef";

function useSafeState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
function useSafeState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
];
/**
 * 一个自定义的钩子，提供了一个安全版本的useState钩子。
 * 只有在组件挂载的情况下才能更新状态。
 *
 * @template S - 状态值的类型。
 * @param {S | (() => S)} [initialState] - 初始状态值或返回初始状态值的函数。
 * @returns {[S, (currentState: S) => void]} - 包含当前状态值和更新状态的函数的元组。
 */
function useSafeState<S>(initialState?: S | (() => S)) {
  const unmountedRef: { current: boolean } = useUnmountedRef();
  const [state, setState] = useState(initialState);
  const setCurrentState = useCallback((currentState: any) => {
    if (unmountedRef.current) return;
    setState(currentState);
  }, []);

  return [state, setCurrentState] as const;
}

export default useSafeState;
