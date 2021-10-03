import { ChangeEvent, Reducer, useEffect, useMemo, useReducer } from "react";
import { reduceArrayMeta } from "../../util/arrays.util";
import { generateId, reducer } from "./constants";
import {
  Action,
  BaseFieldArrayOptions,
  FieldArrayActions,
  State,
  FieldArrayData,
  FieldArrayMeta,
} from "./types";

export function useBaseFieldArray<T, E = HTMLInputElement>(
  options: BaseFieldArrayOptions<T, E>
): [FieldArrayData<T, E>[], FieldArrayMeta, FieldArrayActions<T>] {
  const {
    checkForErrors,
    extractValue,
    checkIfEmpty,
    initialValue,
    isRequired,
    defaultValue,
  } = options;
  const initialValuesJson = JSON.stringify(initialValue)
  const { initialState, initialValues } = useMemo(
    () => {
      const initialState: State<T> =
        Array.isArray(initialValue)
          ? initialValue.map((val) => ({
            wasTouched: false,
            isFocussed: false,
            error: undefined,
            value: val,
            id: generateId()
          }))
          : []
      const initialValues = initialState.map(x => x.value)
      return { initialState, initialValues }
    },
    [initialValuesJson]
  );


  // Required to prevent errors about uncontrolled inputs turning controlled
  const newItemValue = Array.isArray(initialValue)
    ? defaultValue // Is <T>-specific, e.g. "", 0
    : initialValue;

  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(
    reducer(newItemValue),
    initialState,
  );

  // Subscribe to initial value changes
  useEffect(() => {
    dispatch({ type: "RESET_ALL", values: initialValues })
  }, [JSON.stringify(initialValues)])

  const required = Boolean(isRequired);

  const appendItem = () => {
    dispatch({ type: "APPEND_ITEM" });
  };

  const onChange = (e: ChangeEvent<E>, index: number) => {
    const _value = extractValue(e.target);
    const meta = items[index].meta;

    const _error = checkForErrors(
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
    dispatch({
      type: "RESET_ALL",
      values: toValues ?? initialState.map((s) => s.value),
    });
  };

  const insertItem = (index: number, value?: T) => {
    dispatch({
      type: "INSERT_ITEM",
      index,
      data: value != null ? { value } : undefined
    })
  }

  const removeItem = (index: number) => {
    dispatch({
      type: "REMOVE_ITEM",
      index,
    })
  }

  const arrayActions: FieldArrayActions<T> = {
    removeItem,
    resetAll,
    insertItem,
    appendItem,
  };

  const items: FieldArrayData<T, E>[] = state.map((item, i) => ({
    props: {
      onBlur: () => onBlur(i),
      onChange: (e: ChangeEvent<E>) => onChange(e, i),
      onFocus: () => onFocus(i),
      value: item.value,
      required,
      key: item.id, // Used solely to stop react warning for array keys
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

  const arrayMeta = reduceArrayMeta(items, initialValues)

  return [items, arrayMeta, arrayActions];
}
