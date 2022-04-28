/* eslint @typescript-eslint/no-explicit-any: "off" */

import {useReducer, Dispatch, forwardRef, useImperativeHandle, createContext} from 'react';

// TODO: Fix types, remove any from all files
export type StateType<T = any> = Record<string, T>;

export type DispatchAction =
  | {
      type: 'CHANGE_VALUE';
      payload: {id: string; action: ChangeStateAction};
    }
  | {
      type: 'CHANGE_VALUES';
      payload: StateType<any>;
    }
  | {
      type: 'RESET';
      payload?: StateType<any>;
    };

export type ChangeStateAction<T = any> = T | ((prevState: T) => T);

// eslint-disable-next-line default-param-last
const FormReducer = (state: StateType = {}, action: DispatchAction) => {
  switch (action.type) {
    case 'CHANGE_VALUE': {
      let newState = state[action.payload.id];

      if (typeof action.payload.action === 'function') {
        newState = action.payload.action(state[action.payload.id]);
      } else {
        newState = action.payload.action;
      }

      return {...state, [action.payload.id]: newState};
    }

    case 'CHANGE_VALUES': {
      return {...state, ...action.payload};
    }

    case 'RESET': {
      return action.payload ? {...action.payload} : {};
    }

    default: {
      return state;
    }
  }
};

export const FormContext = createContext<[StateType, Dispatch<DispatchAction>]>(null as any);

export interface Props<T = any> {
  /**
   * Initial state of the form. This is required and all fields must be defined.
   */
  initialState: StateType<T>;

  children?: React.ReactNode;
}

interface RefHandle {
  change: (state: StateType) => void;
  changeValue: (id: string, action: ChangeStateAction) => void;
  reset: () => void;
  clear: () => void;
}

type FormProvider = RefHandle;

/**
 * FormProvider is a wrapper for your form.
 *
 * <details>
 *  <summary>Example</summary>
 *
 *  ```jsx
 *  <FormProvider>
 *    // Your form elements and other content
 *  </FormProvider>
 *  ```
 * </details>
 */
const FormProvider = forwardRef<RefHandle, Props>(({initialState, children}, ref) => {
  const reducer = useReducer(FormReducer, initialState || {});

  /**
   * Change the current state of the form with the given state.
   * Only the fields that are defined in the state will be changed.
   * @param state State to change to.
   */
  const change = (state: StateType) => {
    reducer[1]({type: 'CHANGE_VALUES', payload: state});
  };

  /**
   * Change the value of the given field.
   * @param id Identifier of the field to change.
   * @param action State or state action to change the value with.
   */
  const changeValue = (id: string, action: ChangeStateAction) => {
    reducer[1]({type: 'CHANGE_VALUE', payload: {id, action}});
  };

  /**
   * Reset the form to the initial state.
   */
  const reset = () => {
    reducer[1]({type: 'RESET', payload: initialState});
  };

  /**
   * Clear the form.
   */
  const clear = () => {
    reducer[1]({type: 'RESET'});
  };

  useImperativeHandle(ref, () => ({
    change,
    changeValue,
    reset,
    clear,
  }));

  return <FormContext.Provider value={reducer}>{children}</FormContext.Provider>;
});

export {FormProvider};
