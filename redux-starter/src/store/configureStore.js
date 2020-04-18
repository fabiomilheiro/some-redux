import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import bugs from "./bugs";
import projects from "./projects.js";
import users from "./users";
import logger from "./middleware/logger";
import toast from "./middleware/toast";
import apiMiddleware from "./middleware/apiMiddleware";

export default function () {
  const reducer = combineReducers({
    entities: combineReducers({
      bugs: bugs.reducer,
      projects: projects.reducer,
      users: users.reducer,
    }),
  });
  return configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware(),
      logger({ isEnabled: false }),
      toast,
      apiMiddleware,
    ],
  });
}
