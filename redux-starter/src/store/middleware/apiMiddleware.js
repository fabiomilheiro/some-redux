import axios from "axios";
import api from "../api";

const apiMiddleware = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== api.actions.requestStarted.type) {
    return next(action);
  }

  const payload = action.payload;

  try {
    if (payload.onStart) {
      dispatch({
        type: payload.onStart,
        payload: {},
      });
    }

    next(action);

    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url: payload.url,
      method: payload.method || "get",
      data: payload.data || {},
    });

    dispatch(api.actions.requestSucceeded(response.data));

    if (payload.onSuccess) {
      dispatch({
        type: payload.onSuccess,
        payload: response.data,
      });
    }

    return response.data;
  } catch (error) {
    // const e = error;
    // debugger;

    dispatch(
      api.actions.requestFailed({
        message: error.message,
        stackTrace: error.stackTrace,
        responseText: error.responseText,
      })
    );

    if (payload.onError) {
      dispatch({
        type: payload.onError,
        payload: error,
      });
    }
  }
};

export default apiMiddleware;
