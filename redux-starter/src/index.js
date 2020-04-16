import configureStore from "./store/configureStore";
import bugs from "./store/bugs";

const store = configureStore();
console.log(store.getState());

const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(bugs.actions.bugAdded({ description: "Bug 1" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 2" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 3" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 4" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 5" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 6" }));
store.dispatch(bugs.actions.bugAdded({ description: "Bug 7" }));

store.dispatch(bugs.actions.bugResolved({ id: 1 }));
store.dispatch(bugs.actions.bugResolved({ id: 5 }));

store.dispatch(bugs.actions.bugRemoved({ id: 3 }));

unsubscribe();
