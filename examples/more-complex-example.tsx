import { createForm } from "react-plough";

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
    if (Number(values.age) < 18 && values.friendNames.length < 1) {
      alert("Cheer up buddy");
    }
    if (!meta.isDirty) {
      throw new Error("Please add some friends");
    }
    console.log(values.age, values.friendNames, values.name);
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
