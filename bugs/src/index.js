import "regenerator-runtime/runtime";
import configureStore from "./store/configureStore";
import bugs from "./store/bugs";
import projects from "./store/projects";

const store = configureStore();

const unsubscribe = store.subscribe(() => {});

store.dispatch(bugs.actions.load());

const state = store.getState();

setTimeout(() => {
  const action = bugs.actions.add({
    description: "Some new bug",
  });

  console.log("New bug action:", action);
  store.dispatch(action);
}, 2000);

setTimeout(() => {
  store.dispatch(bugs.actions.assign(1, 2));
  store.dispatch(bugs.actions.assign(2, 2));
  store.dispatch(bugs.actions.assign(3, 1));
  store.dispatch(bugs.actions.assign(4, 1));

  store.dispatch(bugs.actions.resolve(1));
}, 3000);

// store.dispatch((dispatch, getState) => {
//   console.log("Executing a dispatched function.");
//   dispatch(
//     projects.actions.projectAdded({
//       name: "Do a masterclass via a dispatch function",
//     })
//   );
// });

// store.dispatch({
//   type: "error",
//   payload: {
//     message: "***** Something happened!",
//   },
// });

// store.dispatch(projects.actions.projectAdded({ name: "Build a new farm" }));

// store.dispatch(users.actions.userAdded({ name: "John" }));
// store.dispatch(users.actions.userAdded({ name: "Mary" }));
// store.dispatch(users.actions.userAdded({ name: "Theresa" }));

// store.dispatch(bugs.actions.bugAdded({ description: "Bug 1" }));
// store.dispatch(bugs.actions.bugAdded({ description: "Bug 2" }));
// store.dispatch(bugs.actions.bugAdded({ description: "Bug 3" }));
// store.dispatch(bugs.actions.bugAdded({ description: "Bug 4" }));
// store.dispatch(bugs.actions.bugAdded({ description: "Bug 5" }));
// store.dispatch(bugs.actions.bugAdded({ description: "Bug 6" }));
// store.dispatch(bugs.actions.bugAdded({ description: "Bug 7" }));

// store.dispatch(bugs.actions.userAssigned({ id: 1, userId: 1 }));
// store.dispatch(bugs.actions.userAssigned({ id: 2, userId: 2 }));
// store.dispatch(bugs.actions.userAssigned({ id: 3, userId: 2 }));
// store.dispatch(bugs.actions.userAssigned({ id: 4, userId: 2 }));
// store.dispatch(bugs.actions.userAssigned({ id: 5, userId: 2 }));
// store.dispatch(bugs.actions.userAssigned({ id: 6, userId: 3 }));
// store.dispatch(bugs.actions.userAssigned({ id: 7, userId: 3 }));

// const unresolved1 = bugs.selectors.getUnresolvedBugs(store.getState());
// const unresolved2 = bugs.selectors.getUnresolvedBugs(store.getState());

// store.dispatch(bugs.actions.bugResolved({ id: 1 }));
// store.dispatch(bugs.actions.bugResolved({ id: 5 }));

// store.dispatch(bugs.actions.bugRemoved({ id: 3 }));

// const unresolved3 = bugs.selectors.getUnresolvedBugs(store.getState());

// const state = store.getState();
// console.log("Bugs for user 1", bugs.selectors.getBugsByUser(1)(state));
// console.log("Bugs for user 2", bugs.selectors.getBugsByUser(2)(state));
// console.log("Bugs for user 3", bugs.selectors.getBugsByUser(3)(state));

unsubscribe();
