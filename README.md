<h1 align="center">React Plough 👨‍🌾</h1>

<p align="center">
    <img src="https://img.shields.io/npm/l/react-plough">
</p>

> A library to help tend your react fields

---

```sh
yarn add react-plough
npm i react-plough
```

`react-plough` helps speed up react form development, by providing narrow, type-safe utilities to make implementing fields simple. Instead of viewing forms as one big object of data, `react-plough` keeps fields' state separate, keeping usage simple, avoiding leaky abstractions and improving performance.

## Basic Usage

```ts
export const ProfileForm = () => {
  const [nameProps, name] = useTextField({
    validate: (name) =>
      name.value.length < 4
        ? "Name must be longer than 3 characters"
        : undefined,
    // Other options
  });

  return (
    <div>
      <input {...nameProps} />
      {name.touched && <p>{name.error}</p>}
      <button onClick={() => alert(name.value)}>Submit</button>
    </div>
  );
};
```

More examples will be added soon, but in the mean time you can check out the [Docs](https://react-plough.vercel.app/). Check out some features below

# Introduction

Being fed up with the complexity, poor performance and invasiveness of existing form libraries, `react-plough` strives to be narrow and straightforward. As such, it should be easy to put into, or take out of, a project. It aims to solve 90% of use cases well rather than 100% of use cases poorly.

## Features

| Feature       | Description                                          |
| ------------- | ---------------------------------------------------- |
| 💪 Type Safe  | Provides a type-safe interface for using form fields |
| 📚 General    | Works well with many different input types           |
| 🪑 Simple     | Has a (mostly) self-explanatory API                  |
| 🤷 Agnostic   | Works with most popular component libraries          |
| 🪶 Lightweight | Is kind to your bundle size                          |

Ultimately, `react-plough` aims to **reduce user error** and **significantly minimize time spent** on forms.

Currently, it supports:

- Text fields
- File fields
- Binary fields (e.g. checkboxes)
- Arrays of the above field types

It also contains helpers for squashing mulitple fields together when you need to submit
