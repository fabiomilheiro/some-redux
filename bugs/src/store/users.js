import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

let lastId = 0;

const slice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    userAdded: (users, { payload }) => {
      users.push({
        id: ++lastId,
        name: payload.name,
      });
    },
  },
});

const selectors = {
  getUsersWithoutBugsAssigned: createSelector(
    (state) => state.entities.users,
    (state) => state.entities.bugs,
    (users, bugs) => {
      let bugsByUser = users.reduce((acc, user) => {
        const newUser = { ...user };
        newUser.bugs = [];
        acc[user.id] = newUser;
        return acc;
      }, {});

      bugs.forEach((bug) => {
        bugsByUser[bug.userId].bugs.push(bug);
      });

      return bugsByUser;
    }
  ),
};

export default {
  actions: slice.actions,
  reducer: slice.reducer,
  selectors,
};
