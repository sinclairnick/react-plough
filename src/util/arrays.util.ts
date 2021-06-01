import {
  FieldArrayActions,
  FieldArrayData,
  FieldArrayItemActions,
} from "../base/base-field-array/types";

export const squashArrayActions = <A extends FieldArrayActions<any>[]>(
  actions: A
) => {
  const addItem = () => actions.forEach((a) => a.addItem());
  const resetAll = () => actions.forEach((a) => a.resetAll());
  return {
    addItem,
    resetAll,
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
    removItem: (index: number) => {
      keys.forEach((key) => groups[key][0][index].actions.remove());
    },
  };

  const data = array.map((_, i) => {
    type FieldArrayItemData = {
      [key in keyof O]: FieldArrayData<
        typeof groups[key][0][typeof i]["meta"]["value"],
        Parameters<
          typeof groups[key][0][typeof i]["props"]["onChange"]
        >["0"]["target"]
      >;
    };
    const obj = {} as FieldArrayItemData;
    keys.forEach((key) => {
      obj[key as K] = groups[key][0][i];
      delete obj[key].actions.remove; // Don't want to have mismatched array shapes
    });
    return obj;
  });
  return [data, actions] as const;
};
