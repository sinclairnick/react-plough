# CHANGELOG

## v0.3

Improve array functionality.

-   Add a `key` prop to the top-level result from `groupFieldArrays` to provide better performance with react re-renders. Set the key to the top level component like

```tsx
const [things] = groupFieldArrays(/*...*/);
/**... */
things.map((thing) => {
    return <div key={thing.key} />;
});
/**...*/
```

-   Add additional array helpers like `insertItem` and `removeItem` for better field array control

## v0.2

Remove the dependencies array, and assume initialValue changes should change the value.
This affects the API shape, as the second parameter to some of the React hooks are now absent.
