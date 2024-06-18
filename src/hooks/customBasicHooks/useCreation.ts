import { useRef } from "react";
import type { DependencyList } from "react";

const depsAreSame = (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean => {
  if (oldDeps === deps) return true;

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }

  return true;
};

/**
 * 自定义 Hook，根据提供的依赖项对值进行记忆化。
 * 只有在依赖项发生变化时，才会重新计算该值。
 *
 * @template T - 要记忆化的值的类型。
 * @param {() => T} fn - 计算要记忆化的值的函数。
 * @param {DependencyList} deps - 在重新计算值时要与之比较的依赖项。
 * @returns {T} - 记忆化的值。
 */
const useCreation = <T,>(fn: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = fn();
    current.initialized = true;
  }

  return current.obj as T;
};

export default useCreation;
