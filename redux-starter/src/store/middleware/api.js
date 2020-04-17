import axios from "axios";

const api = ({ dispatch }) => (next) => async (action) => {
  if (!action.type.endsWith("Requested")) {
    return next(action);
  }

  next(action);

  const payload = action.payload;

  try {
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url: payload.url,
      method: payload.mehtod || "get",
      data: payload.data || {},
    });

    dispatch({
      type: payload.onSuccess,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: payload.onError,
      payload: error,
    });
  }
};

export default api;
