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
  /**
   * Returns the value of the given field.
   * @param id Identifier of the field to change.
   */
  getValue: (id: string) => any;

  /**
   * Returns the values of all fields.
   */
  getValues: () => Record<string, any>;

  /**
   * Returns the error of the given field.
   * @param id Identifier of the field to change.
   */
  getError: (id: string) => any;

  /**
   * Returns the errors of all fields.
   */
  getErrors: () => Record<string, string>;

  /**
   * Change the value of the given field.
   * @param id Identifier of the field to change.
   * @param action State or state action to change the value with.
   */
  changeValue: (id: string, action: ChangeStateAction) => void;

  /**
   * Change the current values of the form with the given state.
   * @param values Values to change to.
   */
  changeValues: (state: StateType['values']) => void;

  /**
   * Change the error of the given field.
   * @param id Identifier of the field to change.
   * @param error Error message.
   */
  changeError: (id: string, error: string) => void;

  /**
   * Change the current errors of the form with the given errors.
   * @param errors Error messages.
   */
  changeErrors: (errors: StateType['errors']) => void;

  /**
   * Resets the form to the initial state.
   */
  reset: () => void;

  /**
   * Clears the form.
   */
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

    const getValue = (id: string) => {
      return reducer[0].values[id];
    };

    const getValues = () => {
      return reducer[0].values;
    };

    const getError = (id: string) => {
      return reducer[0].errors[id];
    };

    const getErrors = () => {
      return reducer[0].errors;
    };

    const changeValue = (id: string, action: ChangeStateAction) => {
      reducer[1]({type: 'CHANGE_VALUE', payload: {id, action}});
    };

    const changeValues = (values: StateType['values']) => {
      reducer[1]({type: 'CHANGE_VALUES', payload: values});
    };

    const changeError = (id: string, error: string) => {
      reducer[1]({type: 'CHANGE_ERROR', payload: {id, error}});
    };

    const changeErrors = (errors: StateType['errors']) => {
      reducer[1]({type: 'CHANGE_ERRORS', payload: errors});
    };

    const reset = () => {
      reducer[1]({type: 'RESET', payload: initialState});
    };

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
