import React, { Dispatch, SetStateAction } from 'react';
import { useUnmountedRef } from 'ahooks';

function useSafeState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>];

function useSafeState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
];

function useSafeState(initialState?: any) {
  const unmountedRef = useUnmountedRef();
  const [state, setState] = React.useState(initialState);
  const setCurrentState = (currentState: any) => {
    /** 如果组件已经卸载则不再更新 state */
    if (unmountedRef.current) return;
    setState(currentState);
  };

  return [state, setCurrentState] as const;
}

export default useSafeState;
