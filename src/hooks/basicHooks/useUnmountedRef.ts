import { useEffect, useRef } from "react";

/**
 * 返回一个 ref 对象，用于指示组件是否已卸载。
 * 当组件已挂载时，ref 对象的 `current` 属性将为 `false`，
 * 当组件已卸载时，ref 对象的 `current` 属性将被设置为 `true`。
 *
 * @returns 带有 `current` 属性的 ref 对象，指示组件的卸载状态。
 */
const useUnmountedRef = (): { readonly current: boolean } => {
  const unmountedRef = useRef<boolean>(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return unmountedRef;
};

export default useUnmountedRef;
