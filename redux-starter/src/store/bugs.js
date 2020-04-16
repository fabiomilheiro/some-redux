import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

let lastId = 0;

const slice = createSlice({
  initialState: [],
  name: "bugs",
  reducers: {
    bugAdded: (bugs, { payload }) => {
      ++lastId;
      bugs.push({
        id: lastId,
        description: payload.description,
        userId: payload.userId,
        resolved: false,
      });
    },
    bugResolved: (bugs, { payload }) => {
      return bugs.filter((b) => b.id !== payload.id);
    },
    bugRemoved: (bugs, { payload }) => {
      const bug = bugs.find((b) => b.id === payload.id);
      bug.resolved = true;
    },
    userAssigned: (bugs, { payload }) => {
      const bug = bugs.find((b) => b.id === payload.id);
      bug.userId = payload.userId;
    },
  },
});

const selectors = {
  getUnresolvedBugs: createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((b) => !b.resolved)
  ),
};

export default {
  actions: slice.actions,
  reducer: slice.reducer,
  selectors,
};
