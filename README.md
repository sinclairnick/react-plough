<h1 align="center">React Plough 👨‍🌾</h1>

<p align="center">
    <img src="https://img.shields.io/bundlephobia/min/react-plough?label=min">
    <img src="https://img.shields.io/npm/l/react-plough">
</p>

> A library to help tend your react fields

---

```sh
yarn add react-plough
npm i react-plough
```

# Basic Example

```ts
export const ProfileForm = () => {
  const [nameProps, name] = useTextField({
      validate: (name) => name.value.length < 4
        ? "Name must be longer than 3 characters"
        : undefined,
        // Other options
  });

  const handleSubmit = async () => {
    // await sendData(name.value)
  }

  return (
    <div>
      <input {...nameProps} />
      <button onClick={handleSubmit}>
    </div>
  );
};
```

# Introduction

`react-plough` provides you with utilities to avoid repeating similar logic for form fields in react. The main goals of this project are to:

| Feature          | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| 💪 Type Safe     | Provide a type-safe interface for using form fields        |
| 🔌 Plug-and-play | Not require a bible worth of documentation to get running  |
| 📚 General       | Work (well) with many different input types                |
| 🪑 Simple        | Only use cost-free abstractions to avoid abstraction leaks |
| 🤷 Agnostic      | Work with (nearly) any component library                   |
| 🪶 Lightweight    | Be kind to your bundle size                                |

Ultimately, `react-plough` aims to **reduce user error** and **significantly minimize time spent** on forms.

Currently, it supports:

- Text fields
- File fields
- Binary fields (e.g. checkboxes)
- Arrays of the above field types
- Utilities to help manage a set of fields for submission

## What this is not

`react-plough` is not a form framework like `Formik`, it does not

- Lock you into using confusing components
- Require react `<Context/>`s
- Use strings to identify fields
- Force form abstractions on you

`react-plough` does not make strong assumptions about how you deal with your forms, or even if a form exists at all.

### Motivation

Having created many react projects, forms are always a nuisance. Even despite prevalent react form frameworks claiming they've aleviated such headaches, the headaches remain. Many are satisfied with existing packages -- and to them, congratulations -- however, for us who are not: this library is hopefully some pain relief.

I wanted a library which could be used as much or as little as possible, without the backseat driving. As such, this project is merely a set of hooks and functions which reduce the boilerplate, and remove some of the (surprising) complexity found in forms. The rest is up to you.
