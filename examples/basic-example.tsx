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
