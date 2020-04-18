const logger = ({ isEnabled }) => (store) => (next) => (action) => {
  if (isEnabled) {
    console.log("Action:", action);
  }

  return next(action);
};

export default logger;
