import { Action, State } from "./types";

export const generateId = () => {
  return `${Math.ceil(Math.random() * 1_000_000)}`
}

// A default value is required for new inputs in the array
export const reducer =
  <T>(defaultValue: T) => {

    return (state: State<T>, action: Action<T>): State<T> => {
      const defaultValues: State<T>[number] = {
        isFocussed: false,
        wasTouched: false,
        error: undefined,
        value: defaultValue,
        id: generateId()
      }
      switch (action.type) {
        case "APPEND_ITEM":
          return [...state, { ...defaultValues, wasTouched: true },];

        case "INSERT_ITEM":
          const [before, after] = [
            state.slice(0, action.index),
            state.slice(action.index)
          ]
          const newItem: State<T>[number] = {
            ...defaultValues,
            ...(action.data ?? {})
          }
          return [
            ...before,
            newItem,
            ...after
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
          values[action.index] = { ...defaultValues, value: action.value }
          return values;
        }

        case "RESET_ALL":
          return action.values.map((val) => ({ ...defaultValues, value: val, }));

        default:
          return state
      }
    };
  }