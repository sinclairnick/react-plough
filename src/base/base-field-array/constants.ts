import { Dispatch, useMemo } from "react";
import { Action, State } from "./types";

export const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "ADD_ITEM":
      return [
        ...state,
        {
          isFocussed: false,
          wasTouched: false,
          error: undefined,
          value: undefined,
        },
      ];
    case "REMOVE_ITEM":
      return state.filter((_, i) => i != action.index);
    case "UPDATE_ITEM": {
      const values = [...state];
      values[action.index] = {
        ...values[action.index],
        ...action.updates,
      };
      return values;
    }
    case "RESET": {
      const values = [...state];
      values[action.index] = {
        isFocussed: false,
        wasTouched: false,
        error: undefined,
        value: action.value,
      };
      return values;
    }
    case "RESET_ALL":
      return action.values.map((val) => ({
        isFocussed: false,
        wasTouched: false,
        error: undefined,
        value: val,
      }));
  }
};

export const generateItemActions = <T>(
  index: number,
  dispatch: Dispatch<Action<T>>
) =>
  useMemo(() => {
    return {
      remove: () => dispatch({ type: "REMOVE_ITEM", index }),
      setValue: (value?: T) =>
        dispatch({
          type: "UPDATE_ITEM",
          index,
          updates: { value },
        }),
      setError: (error?: string) =>
        dispatch({
          type: "UPDATE_ITEM",
          index,
          updates: { error },
        }),
      setWasTouched: (touched?: boolean) =>
        dispatch({
          type: "UPDATE_ITEM",
          index,
          updates: { wasTouched: touched },
        }),
      setIsFocussed: (focussed?: boolean) =>
        dispatch({
          type: "UPDATE_ITEM",
          index,
          updates: { isFocussed: focussed },
        }),
    };
  }, [dispatch, index]);
