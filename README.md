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

`react-plough` is yet another react form library. It aims to improve developer experience and reduce user error by providing strongly typed and performant interfaces for react form fields. Unlike existing form libraries, `plough` does not use react context and does not require any manual type annotation.

## Basic Usage

```ts
const form = createForm({
  name: "",
  age: "8",
  friendNames: [""],
});

export const ProfileForm = () => {
  const [nameProps, name] = form.useName();
  const [ageProps, age] = form.useAge({
    validate: (val) => (Number(val) < 18 ? "Must be over 18" : undefined),
  });

  return (
    <div>
      <input {...nameProps} />
      <input {...ageProps} type="number" />
    </div>
  );
};

// <name> or <age> won't trigger updates here
export const FriendForm = () => {
  const [friends, friendsActions] = form.useFriends();

  const handleSave = () => {
    const values = form.collect(); // Includes <name> and <age>
    // ... do something with the form values
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

More examples will be added soon, but in the mean time you can check out the [Docs](https://react-plough.vercel.app/). Check out some features below
