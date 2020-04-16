import { produce } from "immer";
import { createAction, createReducer } from "@reduxjs/toolkit";

export const actions = {
  bugAdded: createAction("bugAdded"),
  bugRemoved: createAction("bugRemoved"),
  bugResolved: createAction("bugResolved"),
};

let lastId = 0;

const reducer = createReducer([], {
  [actions.bugAdded]: (bugs, action) => {
    ++lastId;
    bugs.push({
      id: lastId,
      description: action.payload.description,
      resolved: false,
    });
  },
  [actions.bugRemoved]: (bugs, action) => {
    return bugs.filter((b) => {
      return b.id !== action.payload.id;
    });
  },
  [actions.bugResolved]: (bugs, action) => {
    const bug = bugs.find((b) => b.id === action.payload.id);
    bug.resolved = true;
  },
});

export default {
  actions,
  reducer,
};
