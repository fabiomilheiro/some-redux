import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;

const slice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    projectAdded: (projects, { payload }) => {
      projects.push({
        id: ++lastId,
        name: payload.name,
      });
    },
  },
});

export default {
  actions: slice.actions,
  reducer: slice.reducer,
};
