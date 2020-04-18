import "regenerator-runtime/runtime";
import configureStore from "../configureStore";
import bugs from "../bugs";

describe("Bugs", () => {
  describe("Add bug", () => {
    let store = null;

    beforeEach(() => {
      store = configureStore();
    });

    it("Update state on success", async () => {
      const newBug = await store.dispatch(bugs.actions.addBug("a"));

      const bugList = store.getState().entities.bugs.list;

      expect(bugList).toHaveLength(1);
      expect(bugList[0]).toEqual(newBug);
    });
  });
});
