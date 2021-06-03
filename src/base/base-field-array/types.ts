import {
  FieldActions,
  FieldMeta,
  FieldMetaWithoutError,
  FieldProps,
} from "../base-field/types";

export type BaseFieldArrayOptions<T> = {
  initialValue: T[] | T;
  isRequired?: boolean;
  defaultValue: T;
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
  wasTouched: boolean;
  isFocussed: boolean;
  error?: string;
  value?: T;
}[];

export type Action<T> =
  | { type: "REMOVE_ITEM"; index: number }
  | { type: "UPDATE_ITEM"; index: number; updates: Partial<State<T>[0]> }
  | { type: "ADD_ITEM" }
  | { type: "RESET"; index: number; value: T }
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
