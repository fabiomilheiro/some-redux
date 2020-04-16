import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bugs from "./bugs";
import projects from "./projects.js";
import users from "./users";

export default function () {
  const reducer = combineReducers({
    entities: combineReducers({
      bugs: bugs.reducer,
      projects: projects.reducer,
      users: users.reducer,
    }),
  });
  return configureStore({ reducer });
}
