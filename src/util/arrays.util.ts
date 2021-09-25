import {
  FieldArrayActions,
  FieldArrayData,
} from "../base/base-field-array/types";

export const squashArrayActions = <A extends FieldArrayActions<any>[]>(
  actions: A
) => {
  const appendItem = () => actions.forEach((a) => a.appendItem());
  const resetAll = () => actions.forEach((a) => a.resetAll());
  const insertItem = (index: number) => actions.forEach((a) => a.insertItem(index))
  const removeItem = (index: number) => actions.forEach((a) => a.removeItem(index))

  return {
    appendItem,
    resetAll,
    insertItem,
    removeItem
  };
};

/**
 * Converts an object of `{key: Array<value>}` to `Array<{key: value}>`
 * @returns [FormData, FormActions]
 */
export const groupFieldArrays = <
  O extends {
    [key: string]: [FieldArrayData<any, any>[], FieldArrayActions<any>];
  },
  K extends keyof O
>(
  groups: O
) => {
  const array = Object.keys(groups).map((k) => groups[k])[0][0];

  const _actions: FieldArrayActions<any>[] = [];
  const keys = Object.keys(groups);
  keys.forEach((key) => _actions.push(groups[key][1]));

  const actions = {
    ...squashArrayActions(_actions),
    removeItem: (index: number) => {
      keys.forEach((key) => groups[key][0][index]?.actions?.remove());
    },
  };

  const data = array.map((_, i) => {
    type FieldArrayItemData = {
      [key in keyof O]: FieldArrayData<
        O[key][0][typeof i]["meta"]["value"],
        Parameters<O[key][0][typeof i]["props"]["onChange"]>["0"]["target"]
      >
    }
    const obj = {} as FieldArrayItemData;
    let compositeKey = ""
    keys.forEach((key) => {
      obj[key as K] = groups[key][0][i];
      compositeKey += obj[key as K].props.key
    });
    return { ...obj, key: compositeKey };
  });
  return [data, actions] as const;
};
