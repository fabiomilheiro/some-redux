import configureStore from "./store/configureStore";
import bugs from "./store/bugs";
import projects from "./store/projects";
import users from "./store/users";

const store = configureStore();

const unsubscribe = store.subscribe(() => {});

store.dispatch(projects.actions.projectAdded({ name: "Do a masterclass" }));
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
