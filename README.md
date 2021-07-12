<h1 align="center">React Plough 👨‍🌾</h1>

<p align="center">
    <img src="https://img.shields.io/npm/l/react-plough">
</p>

> A library to help tend your react fields

```sh
yarn add react-plough
npm i react-plough
```

`react-plough` is yet another react form library. It aims to improve developer experience and reduce user error by providing strongly typed and performant interfaces for react form fields. Unlike existing form libraries, `plough` does not use react context and does not require any manual type annotation. In other words, it is lightweight and hard to break.

Check out the [Docs](https://react-plough.vercel.app/)

---

## Basic Usage

Plough views fields as the atomic unit of user-input and uses a familiar API, but is designed as a library, not a framework. As such, plough fits around your code, instead of fitting your code around itself. A basic example looks like:

```ts
import { useTextField } from "react-plough";

const LoginForm = () => {
  const [nameProps, name] = useTextField({
    validate: (name) =>
      name.value.length === 0 ? "Name must be provided" : undefined,
  });

  const [passwordProps, password] = useTextField({
    validate: (password) =>
      password.value.length === 0 ? "Password is required" : undefined,
  });

  const handleSubmit = () => {
    alert(`${name.value} ${password.value}`);
  };

  return (
    <div>
      <input {...nameProps} />
      <input {...passwordProps} />
      <button onClick={handleSubmit}></button>
    </div>
  );
};
```

The fields are not dependent on each other and don't use any react context. This means it causes the minimum amount of re-renders, and gradual adoption is simple.

However, forms often exist across several layers of the DOM tree, have lists of fields and have more complicated requirements. As such, opt-in utilities exist to enable complicated use-cases too.

---

## A more realistic example

```ts
const form = createForm({
  name: "",
  age: "8", // HTML <input/> numbers are still strings
  friendNames: [""],
});

export const ProfileForm = () => {
  const [nameProps] = form.useName();
  const [ageProps] = form.useAge({
    validate: (val) => (Number(val) < 18 ? "Must be over 18" : undefined),
  });

  return (
    <div>
      <input {...nameProps} />
      <input {...ageProps} type="number" />
      <FriendForm />
    </div>
  );
};

// <name> or <age> won't trigger updates here
export const FriendForm = () => {
  const [friends, friendsActions] = form.useFriendNames();

  const handleSave = () => {
    const [values, meta] = form.collect(); // Includes <name> and <age>
    if (!meta.isDirty) {
      throw new Error("Please add some friends");
    }
    alert(values);
  };

  return (
    <div>
      {friends.map((friend, i) => (
        <div>
          <input {...friend.props} />
          <button onClick={friend.actions.remove}>Delete</button>
        </div>
      ))}
      <button onClick={friendsActions.addItem}>Add friend</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```

The `createForm` function simply wraps some utilities (also available as standalones) and makes the variables accessible to elsewhere in the codebase when needed.
