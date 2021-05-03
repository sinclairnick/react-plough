import { ChangeEvent, Reducer, useMemo, useReducer } from "react";
import { reducer } from "./constants";
import { generateId } from "./constants";
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
        id: generateId(),
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
  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const onChange = async (e: ChangeEvent<E>, id: string) => {
    const _value = extractValue(e.target);

    const index = state.findIndex((x) => x.id === id);
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
      id,
      updates: { error: _error, value: _value },
    });
  };

  const onBlur = async (id: string) => {
    const index = state.findIndex((x) => x.id === id);
    const meta = items[index].meta;
    const _error = await checkForErrors(
      { ...meta, wasTouched: true, isFocussed: false },
      items.map((item) => item.meta)
    );
    dispatch({
      type: "UPDATE_ITEM",
      id,
      updates: { isFocussed: false, wasTouched: true, error: _error },
    });
  };

  const onFocus = async (id: string) => {
    const index = state.findIndex((x) => x.id === id);
    const meta = items[index].meta;
    const _error = await checkForErrors(
      { ...meta, wasTouched: true, isFocussed: false },
      items.map((item) => item.meta)
    );
    dispatch({
      type: "UPDATE_ITEM",
      id,
      updates: { isFocussed: true, wasTouched: true, error: _error },
    });
  };

  const reset = (id: string, toValue?: T) => {
    dispatch({
      type: "RESET",
      id,
      value: toValue ?? initialState.find((x) => x.id === id).value,
    });
  };

  const resetAll = (toValues?: T[]) => {
    dispatch({ type: "RESET_ALL", values: toValues ?? initialValues });
  };

  const arrayActions: FieldArrayActions<T> = {
    resetAll,
    addItem,
  };

  const items: FieldArrayData<T, E>[] = state.map((item) => ({
    props: {
      onBlur: () => onBlur(item.id),
      onChange: (e: ChangeEvent<E>) => onChange(e, item.id),
      onFocus: () => onFocus(item.id),
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
      isDirty: initialState.find((x) => x.id === item.id)?.value !== item.value,
      isEmpty: checkIfEmpty(item.value),
      isRequired: required,
    },
    actions: {
      remove: () => removeItem(item.id),
      reset: () => reset(item.id),
    },
  }));
  return [items, arrayActions];
}
