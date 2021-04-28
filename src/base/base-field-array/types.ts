import {
  FieldActions,
  FieldMeta,
  FieldMetaWithoutError,
  FieldProps,
} from "../base-field/types";

export type BaseFieldArrayOptions<T> = {
  initialValues: T[];
  isRequired?: boolean;
  checkForErrors: (
    itemMeta: FieldMetaWithoutError<any>,
    allMeta: FieldMetaWithoutError<any>[]
  ) => Promise<string | undefined> | (string | undefined);
  extractValue: (target: EventTarget) => T;
  checkIfEmpty: (val: T) => boolean;
};

export type FieldArrayItemActions<T> = FieldActions<T> & {
  remove: () => void;
  reset: (toValues?: T) => void;
};

export type FieldArrayActions<T> = {
  addItem: () => void;
  resetAll: (toValues?: T[]) => void;
};

export type State<T> = {
  id: string;
  wasTouched: boolean;
  isFocussed: boolean;
  error?: string;
  value?: T;
}[];

export type Action<T> =
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_ITEM"; id: string; updates: Partial<State<T>[0]> }
  | { type: "ADD_ITEM" }
  | { type: "RESET"; id: string; value: T }
  | { type: "RESET_ALL"; values: T[] };

export type ReducerFunction = <T>(
  state: State<T>,
  action: Action<T>
) => State<T>;

export type FieldArrayOptions<T> = {
  initialValues?: T[];
  validate?: (
    itemMeta: FieldMetaWithoutError<T>,
    allMeta: FieldMetaWithoutError<T>[]
  ) => Promise<string | undefined> | string | undefined;
  transform?: (val: T) => T;
  label?: string;
  isRequired?: boolean;
};

export type FieldArrayData<T, E> = {
  props: FieldProps<T, E>;
  meta: FieldMeta<T>;
  actions: FieldArrayItemActions<T>;
};
