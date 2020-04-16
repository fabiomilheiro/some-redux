import configureStore from "./store/configureStore";
import bugs from "./store/bugs";
import projects from "./store/projects";

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log(
    `Unresolved bugs: ${
      bugs.selectors.getUnresolvedBugs(store.getState()).length
    }`
  );
});

store.dispatch(projects.actions.projectAdded({ name: "Do a masterclass" }));
store.dispatch(projects.actions.projectAdded({ name: "Build a new farm" }));

store.dispatch(bugs.actions.bugAdded({ description: "Bug 1" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 2" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 3" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 4" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 5" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 6" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 7" }));

const unresolved1 = bugs.selectors.getUnresolvedBugs(store.getState());
const unresolved2 = bugs.selectors.getUnresolvedBugs(store.getState());

store.dispatch(bugs.actions.bugResolved({ id: 1 }));
store.dispatch(bugs.actions.bugResolved({ id: 5 }));

store.dispatch(bugs.actions.bugRemoved({ id: 3 }));

const unresolved3 = bugs.selectors.getUnresolvedBugs(store.getState());

unsubscribe();
