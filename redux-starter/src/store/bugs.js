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
    bugsRequestStarted: (bugs) => {
      bugs.isLoading = true;
    },

    bugsRequestSucceeded: (bugs, { payload }) => {
      bugs.list = payload;
      bugs.isLoading = false;
    },

    bugsRequestFailed: (bugs) => {
      bugs.isLoading = false;
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
  loadBugs: () => {
    return api.actions.requestStarted({
      url: "/bugs",
      onStart: slice.actions.bugsRequestStarted.type,
      onSuccess: slice.actions.bugsRequestSucceeded.type,
      onError: slice.actions.bugsRequestFailed.type,
    });
  },
};

export default {
  actions: { ...slice.actions, ...actions },
  reducer: slice.reducer,
  selectors,
};
