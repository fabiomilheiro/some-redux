import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

let lastId = 0;

const slice = createSlice({
  initialState: [],
  name: "bugs",
  reducers: {
    bugAdded: (bugs, action) => {
      ++lastId;
      bugs.push({
        id: lastId,
        description: action.payload.description,
        resolved: false,
      });
    },
    bugResolved: (bugs, action) => {
      return bugs.filter((b) => b.id !== action.payload.id);
    },
    bugRemoved: (bugs, action) => {
      const bug = bugs.find((b) => b.id === action.payload.id);
      bug.resolved = true;
    },
  },
});

export default {
  actions: slice.actions,
  reducer: slice.reducer,
  selectors: {
    getUnresolvedBugs: createSelector(
      (state) => state.entities.bugs,
      (bugs) => bugs.filter((b) => !b.resolved)
    ),
  },
};
