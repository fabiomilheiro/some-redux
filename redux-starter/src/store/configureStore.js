import { configureStore } from "@reduxjs/toolkit";
import bugs from "./bugs";

export default function () {
  return configureStore({ reducer: bugs.reducer });
}
