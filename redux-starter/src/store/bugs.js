import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import api from "./api";
import moment from "moment";

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
      bugs.lastFetch = Date.now();
    },

    bugsRequestFailed: (bugs) => {
      bugs.isLoading = false;
    },

    bugAdded: (bugs, { payload }) => {
      bugs.list.push(payload);
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
  loadBugs: () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;

    var minutesSinceLastUpdate = moment().diff(moment(lastFetch), "minutes");

    if (lastFetch && minutesSinceLastUpdate < 10) {
      return;
    }

    return dispatch(
      api.actions.requestStarted({
        url: "/bugs",
        onStart: slice.actions.bugsRequestStarted.type,
        onSuccess: slice.actions.bugsRequestSucceeded.type,
        onError: slice.actions.bugsRequestFailed.type,
      })
    );
  },

  addBug: (data) =>
    api.actions.requestStarted({
      url: "/bugs",
      method: "post",
      data: data,
      onSuccess: slice.actions.bugAdded.type,
    }),
};

export default {
  actions: { ...slice.actions, ...actions },
  reducer: slice.reducer,
  selectors,
};
