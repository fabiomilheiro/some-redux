import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bugs from "./bugs";
import projects from "./projects.js";

export default function () {
  const reducer = combineReducers({
    entities: combineReducers({
      bugs: bugs.reducer,
      projects: projects.reducer,
    }),
  });
  return configureStore({ reducer });
}
