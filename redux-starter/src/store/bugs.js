import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import api from "./api";

let lastId = 0;

const slice = createSlice({
  initialState: {
    list: [],
    isLoading: false,
    lastFetch: null,
  },
  name: "bugs",
  reducers: {
    bugsReceived: (bugs, { payload }) => {
      bugs.list = payload;
    },
    bugAdded: (bugs, { payload }) => {
      ++lastId;
      bugs.list.push({
        id: lastId,
        description: payload.description,
        userId: payload.userId,
        resolved: false,
      });
    },
    bugResolved: (bugs, { payload }) => {
      return bugs.list.filter((b) => b.id !== payload.id);
    },
    bugRemoved: (bugs, { payload }) => {
      const bug = bugs.list.find((b) => b.id === payload.id);
      bug.resolved = true;
    },
    userAssigned: (bugs, { payload }) => {
      const bug = bugs.list.find((b) => b.id === payload.id);
      bug.userId = payload.userId;
    },
  },
});

const selectors = {
  getUnresolvedBugs: createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((b) => !b.resolved)
  ),
  getBugsByUser: (userId) =>
    createSelector(
      (state) => state.entities.bugs,
      (bugs) => bugs.list.filter((b) => b.userId === userId)
    ),
};

const actions = {
  loadBugs: () =>
    api.actions.requestStarted({
      url: "/bugs",
      onSuccess: slice.actions.bugsReceived.type,
    }),
};

export default {
  actions: { ...slice.actions, ...actions },
  reducer: slice.reducer,
  selectors,
};
