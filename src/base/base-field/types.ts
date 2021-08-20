import { ChangeEvent } from "react";

export type BaseFieldOptions<T, E> = {
  initialValue: T;
  isRequired?: boolean;
  checkForErrors: (
    meta: FieldMetaWithoutError<any>
  ) => Promise<string | undefined> | string | undefined;
  extractValue: (target: EventTarget & E) => T;
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
  setValue: (toValue: T) => void;
  setWasTouched: (touched: boolean) => void;
  setIsFocussed: (focussed: boolean) => void;
  setError: (error?: string) => void;
};

export type FieldMetaWithoutError<T> = Omit<FieldMeta<T>, "error" | "hasError">;

export type FieldProps<T, E> = {
  onChange: (e: ChangeEvent<E>) => void | Promise<void>;
  onBlur: () => void | Promise<void>;
  onFocus: () => void | Promise<void>;
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
