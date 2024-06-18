export type BasicTarget<T = any> = React.RefObject<T> | (() => T) | T;

type TargetType = HTMLElement | Element | Window | Document;

const getTarget = <T extends TargetType>(target: BasicTarget<T>) => {
  let targetElement: any;

  if (!target) {
    targetElement = window;
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
};
export default getTarget;
