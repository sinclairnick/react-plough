import { ChangeEvent, Reducer, useMemo, useReducer } from "react";
import { reducer } from "./constants";
import {
  Action,
  BaseFieldArrayOptions,
  FieldArrayActions,
  State,
  FieldArrayData,
} from "./types";

export function useBaseFieldArray<T, E = HTMLInputElement>(
  options: BaseFieldArrayOptions<T>
): [FieldArrayData<T, E>[], FieldArrayActions<T>] {
  const {
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValues,
    isRequired,
  } = options;
  const initialState: State<T> = useMemo(
    () =>
      (initialValues ?? []).map((val) => ({
        wasTouched: false,
        isFocussed: false,
        error: undefined,
        value: val,
      })),
    [...initialValues]
  );

  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
    reducer,
    initialState
  );

  const required = Boolean(isRequired);

  const addItem = () => {
    dispatch({ type: "ADD_ITEM" });
  };

  const onChange = async (e: ChangeEvent<E>, index: number) => {
    const _value = extractValue(e.target);
    const meta = items[index].meta;

    const _error = await checkForErrors(
      {
        ...meta,
        value: _value,
      },
      items.map((item) => item.meta)
    );
    dispatch({
      type: "UPDATE_ITEM",
      index,
      updates: { error: _error, value: _value },
    });
  };

  const onBlur = async (index: number) => {
    const meta = items[index].meta;
    const _error = await checkForErrors(
      { ...meta, wasTouched: true, isFocussed: false },
      items.map((item) => item.meta)
    );
    dispatch({
      type: "UPDATE_ITEM",
      index,
      updates: { isFocussed: false, wasTouched: true, error: _error },
    });
  };

  const onFocus = async (index: number) => {
    const meta = items[index].meta;
    const _error = await checkForErrors(
      { ...meta, wasTouched: true, isFocussed: false },
      items.map((item) => item.meta)
    );
    dispatch({
      type: "UPDATE_ITEM",
      index,
      updates: { isFocussed: true, wasTouched: true, error: _error },
    });
  };

  const reset = (index: number, toValue?: T) => {
    dispatch({
      type: "RESET",
      index,
      value: toValue ?? initialState[index]?.value,
    });
  };

  const resetAll = (toValues?: T[]) => {
    dispatch({ type: "RESET_ALL", values: toValues ?? initialValues });
  };

  const arrayActions: FieldArrayActions<T> = {
    resetAll,
    addItem,
  };

  const items: FieldArrayData<T, E>[] = state.map((item, i) => ({
    props: {
      onBlur: () => onBlur(i),
      onChange: (e: ChangeEvent<E>) => onChange(e, i),
      onFocus: () => onFocus(i),
      value: item.value,
      required,
      key: i, // Used solely to stop react warning for array keys
    },
    meta: {
      error: item.error,
      wasTouched: item.wasTouched,
      value: item.value,
      isFocussed: item.isFocussed,
      hasError: item.error != null,
      isDirty: initialState[i]?.value !== item.value,
      isEmpty: checkIfEmpty(item.value),
      isRequired: required,
    },
    actions: {
      remove: () =>
        dispatch({
          type: "REMOVE_ITEM",
          index: i,
        }),
      setValue: (value?: T) =>
        dispatch({
          type: "UPDATE_ITEM",
          index: i,
          updates: { value },
        }),
      setError: (error?: string) =>
        dispatch({
          type: "UPDATE_ITEM",
          index: i,
          updates: { error },
        }),
      setWasTouched: (touched?: boolean) =>
        dispatch({
          type: "UPDATE_ITEM",
          index: i,
          updates: { wasTouched: touched },
        }),
      setIsFocussed: (focussed?: boolean) =>
        dispatch({
          type: "UPDATE_ITEM",
          index: i,
          updates: { isFocussed: focussed },
        }),
      reset: () => reset(i),
    },
  }));
  return [items, arrayActions];
}
