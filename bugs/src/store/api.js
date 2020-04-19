import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "api",
  initialState: {},
  reducers: {
    requestStarted: (state, action) => {},
    requestSucceeded: (state, action) => {},
    requestFailed: (state, action) => {},
  },
});

export default {
  actions: slice.actions,
  reducer: slice.reducer,
};
