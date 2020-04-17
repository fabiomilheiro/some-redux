const logger = (implementation) => (store) => (next) => (action) => {
  console.log("Logging implementation (before):", action);
  next(action);
};

export default logger;
