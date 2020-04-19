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
    loadStarted: (bugs) => {
      bugs.isLoading = true;
    },

    loadSucceeded: (bugs, { payload }) => {
      bugs.list = payload;
      bugs.isLoading = false;
      bugs.lastFetch = Date.now();
    },

    loadFailed: (bugs) => {
      bugs.isLoading = false;
    },

    addSucceeded: (bugs, { payload }) => {
      bugs.list.push(payload);
    },

    removed: (bugs, { payload }) => {
      bugs.list = getBug(bugs, payload.id);
    },

    resolved: (bugs, { payload }) => {
      const bug = getBug(bugs, payload.id);
      bug.resolved = payload.resolved;
    },

    assigned: (bugs, { payload }) => {
      const bug = getBug(bugs, payload.id);
      bug.userId = payload.userId;
    },
  },
});

function getBug(bugs, id) {
  return bugs.list.find((b) => b.id === id);
}

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
  load: () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.bugs;

    var minutesSinceLastUpdate = moment().diff(moment(lastFetch), "minutes");

    if (lastFetch && minutesSinceLastUpdate < 10) {
      return;
    }

    return dispatch(
      api.actions.requestStarted({
        url: "/bugs",
        onStart: slice.actions.loadStarted.type,
        onSuccess: slice.actions.loadSucceeded.type,
        onError: slice.actions.loadFailed.type,
      })
    );
  },

  add: (description) =>
    api.actions.requestStarted({
      url: "/bugs",
      method: "post",
      data: { description },
      onSuccess: slice.actions.addSucceeded.type,
    }),

  assign: (id, userId) =>
    api.actions.requestStarted({
      url: `/bugs/${id}`,
      method: "patch",
      data: { userId },
      onSuccess: slice.actions.assigned.type,
    }),

  resolve: (id) =>
    api.actions.requestStarted({
      url: `/bugs/${id}`,
      method: "patch",
      data: { resolved: true },
      onSuccess: slice.actions.resolved.type,
    }),
};

export default {
  actions,
  reducer: slice.reducer,
  selectors,
};
