/* eslint @typescript-eslint/no-explicit-any: "off" */

import {
  useReducer,
  Dispatch,
  forwardRef,
  useImperativeHandle,
  useMemo,
  createContext,
  Reducer,
} from 'react';
import {AnySchema} from 'yup';

// TODO: Fix types, remove any from all files
export type StateType<T = any> = {
  values: Record<string, T>;
  errors: Record<string, string>;
};

const INITIAL_STATE: StateType = {
  values: {},
  errors: {},
};

export type DispatchAction =
  | {
      type: 'CHANGE_VALUE';
      payload: {id: string; action: ChangeStateAction};
    }
  | {
      type: 'CHANGE_VALUES';
      payload: StateType<any>['values'];
    }
  | {
      type: 'CHANGE_ERROR';
      payload: {id: string; error: string};
    }
  | {
      type: 'CHANGE_ERRORS';
      payload: StateType<any>['errors'];
    }
  | {
      type: 'RESET';
      payload?: StateType<any>;
    };

export type ChangeStateAction<T = any> = T | ((prevState: T) => T);

// eslint-disable-next-line default-param-last
const FormReducer: Reducer<StateType, DispatchAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_VALUE': {
      let newState = state.values[action.payload.id];

      if (typeof action.payload.action === 'function') {
        newState = action.payload.action(state.values[action.payload.id]);
      } else {
        newState = action.payload.action;
      }

      return {...state, values: {...state.values, [action.payload.id]: newState}};
    }

    case 'CHANGE_VALUES': {
      return {...state, values: action.payload};
    }

    case 'CHANGE_ERROR': {
      return {...state, errors: {...state.errors, [action.payload.id]: action.payload.error}};
    }

    case 'CHANGE_ERRORS': {
      return {...state, errors: action.payload};
    }

    case 'RESET': {
      return action.payload ? {...action.payload} : {values: {}, errors: {}};
    }

    default: {
      return state;
    }
  }
};

export const FormContext = createContext<[StateType<any>, Dispatch<DispatchAction>]>(null as any);

export const ValidatorContext = createContext<Record<string, AnySchema> | undefined>(undefined);

export interface Props<T = any> {
  /**
   * Initial state of the form. This is required and all fields must be defined.
   */
  readonly initialState: Readonly<StateType<T>['values']>;

  /**
   * Validator yup object schema.
   */
  validator?: Record<string, AnySchema>;

  children?: React.ReactNode;
}

interface RefHandle {
  getValue: (id: string) => any;
  getValues: () => Record<string, any>;
  getError: (id: string) => any;
  getErrors: () => Record<string, string>;
  changeValue: (id: string, action: ChangeStateAction) => void;
  changeValues: (state: StateType['values']) => void;
  changeError: (id: string, error: string) => void;
  changeErrors: (errors: StateType['errors']) => void;
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
const FormProvider = forwardRef<RefHandle, Props>(
  ({initialState: initialStateProp, validator, children}, ref) => {
    const initialState: StateType<any> = useMemo(
      () => ({
        values: initialStateProp,
        errors: Object.fromEntries(Object.entries(initialStateProp).map(([key]) => [key, ''])),
      }),
      [initialStateProp],
    );

    const reducer = useReducer(FormReducer, initialState);

    /**
     * Returns the value of the given field.
     * @param id Identifier of the field to change.
     */
    const getValue = (id: string) => {
      return reducer[0].values[id];
    };

    /**
     * Returns the values of all fields.
     */
    const getValues = () => {
      return reducer[0].values;
    };

    /**
     * Returns the error of the given field.
     * @param id Identifier of the field to change.
     */
    const getError = (id: string) => {
      return reducer[0].errors[id];
    };

    /**
     * Returns the errors of all fields.
     */
    const getErrors = () => {
      return reducer[0].errors;
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
     * Change the current values of the form with the given state.
     * @param values Values to change to.
     */
    const changeValues = (values: StateType['values']) => {
      reducer[1]({type: 'CHANGE_VALUES', payload: values});
    };

    /**
     * Change the error of the given field.
     * @param id Identifier of the field to change.
     * @param error Error message.
     */
    const changeError = (id: string, error: string) => {
      reducer[1]({type: 'CHANGE_ERROR', payload: {id, error}});
    };

    /**
     * Change the current errors of the form with the given errors.
     * @param errors Error messages.
     */
    const changeErrors = (errors: StateType['errors']) => {
      reducer[1]({type: 'CHANGE_ERRORS', payload: errors});
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
      getValue,
      getValues,
      getError,
      getErrors,
      changeValue,
      changeValues,
      changeError,
      changeErrors,
      reset,
      clear,
    }));

    return (
      <FormContext.Provider value={reducer}>
        <ValidatorContext.Provider value={validator}>{children}</ValidatorContext.Provider>
      </FormContext.Provider>
    );
  },
);

export {FormProvider};
