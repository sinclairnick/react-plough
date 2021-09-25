import {
  FieldActions,
  FieldMeta,
  FieldMetaWithoutError,
  FieldProps,
} from "../base-field/types";

export type BaseFieldArrayOptions<T, E> = {
  initialValue: T[] | T;
  isRequired?: boolean;
  defaultValue: T;
  checkForErrors: (
    itemMeta: FieldMetaWithoutError<any>,
    allMeta: FieldMetaWithoutError<any>[]
  ) => (string | undefined);
  extractValue: (target: EventTarget & E) => T;
  checkIfEmpty: (val: T) => boolean;
};

export type FieldArrayItemActions<T> = FieldActions<T> & {
  remove: () => void;
  reset: (toValues?: T) => void;
};

export type FieldArrayActions<T> = {
  insertItem: (index: number, value?: T) => void;
  removeItem: (index: number) => void;
  appendItem: () => void;
  resetAll: (toValues?: T[]) => void;
};

export type State<T> = {
  wasTouched: boolean;
  isFocussed: boolean;
  error?: string;
  value: T;
  id: string;
}[];

export type Action<T> =
  | { type: "REMOVE_ITEM"; index: number }
  | { type: "UPDATE_ITEM"; index: number; updates: Partial<State<T>[number]> }
  | { type: "APPEND_ITEM" }
  | { type: "INSERT_ITEM", index: number, data?: Partial<State<T>[number]> }
  | { type: "RESET"; index: number; value: T }
  | { type: "RESET_ALL"; values: T[] };

export type ReducerFunction = <T>(
  state: State<T>,
  action: Action<T>
) => State<T>;

export type FieldArrayOptions<T> = {
  initialValue?: T[] | T;
  validate?: (
    itemMeta: FieldMetaWithoutError<T>,
    allMeta: FieldMetaWithoutError<T>[]
  ) => string | undefined;
  transform?: (val: T) => T;
  label?: string;
  isRequired?: boolean;
};

export type FieldArrayData<T, E> = {
  props: FieldProps<T, E>;
  meta: FieldMeta<T>;
  actions: FieldArrayItemActions<T>;
};
