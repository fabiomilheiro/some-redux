const error = (store) => (next) => (action) => {
  if (action.type === "error") {
    console.log("Error:", action.payload.message);
  }

  return next(action);
};

export default error;
