import axios from "axios";
import api from "../api";

const apiMiddleware = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== api.actions.requestStarted.type) {
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

    dispatch(api.actions.requestSucceeded(response.data));

    if (payload.onSuccess) {
      dispatch({
        type: payload.onSuccess,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(api.actions.requestFailed(error));

    if (payload.onError) {
      dispatch({
        type: payload.onError,
        payload: error,
      });
    }
  }
};

export default apiMiddleware;
