import { Action, State } from "./types";

export const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "ADD_ITEM":
      return [
        ...state,
        {
          id: generateId(),
          isFocussed: false,
          wasTouched: false,
          error: undefined,
          value: undefined,
        },
      ];
    case "REMOVE_ITEM":
      return state.filter((val) => val.id !== action.id);
    case "UPDATE_ITEM": {
      const values = [...state];
      const resetIndex = values.findIndex((x) => x.id === action.id);
      values[resetIndex] = {
        ...values[resetIndex],
        ...action.updates,
      };
      return values;
    }
    case "RESET": {
      const values = [...state];
      const resetIndex = values.findIndex((x) => x.id === action.id);
      values[resetIndex] = {
        id: generateId(),
        isFocussed: false,
        wasTouched: false,
        error: undefined,
        value: action.value,
      };
      return values;
    }
    case "RESET_ALL":
      return action.values.map((val) => ({
        id: generateId(),
        isFocussed: false,
        wasTouched: false,
        error: undefined,
        value: val,
      }));
  }
};

export const generateId = () => `${Math.ceil(Math.random() * 1000000000)}`;
