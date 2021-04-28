import { ChangeEvent } from "react";

export type BaseFieldOptions<T> = {
  initialValue: T;
  isRequired?: boolean;
  checkForErrors: (
    meta: FieldMetaWithoutError<any>
  ) => Promise<string | undefined> | string | undefined;
  extractValue: (target: EventTarget) => T;
  checkIfEmpty: (val: T) => boolean;
  deps: any[];
};

export type FieldMeta<T> = {
  value: T;
  wasTouched: boolean;
  isDirty: boolean;
  error: string | undefined;
  hasError: boolean;
  isFocussed: boolean;
  isRequired: boolean;
  isEmpty: boolean;
};

export type FieldActions<T> = {
  reset: (toValue?: T) => void;
};

export type FieldMetaWithoutError<T> = Omit<FieldMeta<T>, "error" | "hasError">;

export type FieldProps<T, E> = {
  onChange: (e: ChangeEvent<E>) => void;
  onBlur: () => void;
  onFocus: () => void;
  value: T;
  required: boolean;
  type?: string;
  key?: string | number;
};

export type FieldOptions<T> = {
  initialValue?: T;
  validate?: (
    meta: FieldMetaWithoutError<T>
  ) => Promise<string | undefined> | string | undefined;
  transform?: (val: T) => T;
  label?: string;
  isRequired?: boolean;
};

export type FieldData<T, E> = [FieldProps<T, E>, FieldMeta<T>];
