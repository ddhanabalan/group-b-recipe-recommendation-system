const Validation = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name Required";
  } else if (values.name.length < 4) {
    errors.name = "Name must be more than 4 char";
  }
  if (!values.password) {
    errors.password = "Password Required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be more than 6 char";
  }

  return errors;
};
export default Validation;
