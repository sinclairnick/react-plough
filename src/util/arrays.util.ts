import {
  FieldArrayActions,
  FieldArrayData,
  FieldArrayMeta,
} from "../base/base-field-array/types";

export const reduceArrayMeta = <
  T extends { meta: FieldArrayMeta & { value?: any } }
>(items: T[], initialValues?: any[]) => {
  const meta: FieldArrayMeta = {
    error: undefined,
    hasError: false,
    isDirty: initialValues?.join(",") !== items.map(item => item.meta.value).join(","),
    isEmpty: items.length === 0,
    isFocussed: false,
    wasTouched: false
  }
  for (const item of items) {
    const {
      error,
      hasError,
      isDirty,
      isFocussed,
      wasTouched
    } = item.meta

    if (meta.error == null && error != null) {
      meta.error = error
    }

    if (hasError === true) {
      meta.hasError = true
    }

    if (isDirty === true) {
      meta.isDirty = true
    }

    if (isFocussed === true) {
      meta.isFocussed = true
    }

    if (wasTouched === true) {
      meta.wasTouched = true
    }
  }
  return meta
}

export const squashArrayActions = <A extends FieldArrayActions<any>[]>(
  actions: A
) => {
  const appendItem = () => actions.forEach((a) => a.appendItem());
  const resetAll = () => actions.forEach((a) => a.resetAll());
  const removeItem = (index: number) => actions.forEach((a) => a.removeItem(index))

  return {
    appendItem,
    resetAll,
    removeItem
  };
};

/**
 * Converts an object of `{key: Array<value>}` to `Array<{key: value}>`
 * @returns [FormData, FormActions]
 */
export const groupFieldArrays = <
  O extends {
    [key: string]: [FieldArrayData<any, any>[], FieldArrayMeta, FieldArrayActions<any>];
  },
  K extends keyof O
>(
  groups: O
) => {
  const array = Object.keys(groups).map((k) => groups[k])[0][0];
  const metas = Object.keys(groups).map((k) => ({ meta: groups[k][1] }))

  const fieldKeys = Object.keys(groups) as K[];
  const _actions: FieldArrayActions<any>[] = fieldKeys.map((key) => groups[key][2]);

  const actions = {
    ...squashArrayActions(_actions),
    insertItem: (index: number, values?: { [key in K]: O[K][0][number]["meta"]["value"] | undefined }) => {
      fieldKeys.forEach((key) => groups[key][2].insertItem(index, values?.[key]))
    },
    removeItem: (index: number) => {
      fieldKeys.forEach((key) => groups[key][0][index]?.actions?.remove());
    },
  };

  const meta = reduceArrayMeta(metas)

  const data = array.map((_, i) => {
    type FieldArrayItemData = {
      [key in keyof O]: FieldArrayData<
        O[key][0][typeof i]["meta"]["value"],
        Parameters<O[key][0][typeof i]["props"]["onChange"]>["0"]["target"]
      >
    }
    const obj = {} as FieldArrayItemData;
    let compositeKey = ""
    fieldKeys.forEach((fieldKey) => {
      obj[fieldKey as K] = groups[fieldKey][0][i];
      compositeKey += obj[fieldKey as K].props.key
    });
    return { ...obj, key: compositeKey };
  });
  return [data, meta, actions] as const;
};
