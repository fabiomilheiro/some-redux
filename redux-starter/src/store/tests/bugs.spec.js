import "regenerator-runtime/runtime";
import configureStore from "../configureStore";
import bugs from "../bugs";

describe("Bugs", () => {
  describe("Add bug", () => {
    let store = null;

    beforeEach(() => {
      store = configureStore();
    });

    it("Updates state on success", async () => {
      const newBug = await store.dispatch(bugs.actions.addBug("a"));

      const bugList = getBugs().list;

      expect(bugList).toHaveLength(1);
      expect(getBugs()).toEqual({
        isLoading: false,
        lastFetch: null,
        list: [newBug],
      });
    });

    it("It does not update state on failure", async () => {
      const previousBugs = getBugs();
      await store.dispatch(bugs.actions.addBug());
      const newBugs = getBugs();
      expect(newBugs).toEqual(previousBugs);
    });

    function getBugs() {
      return store.getState().entities.bugs;
    }
  });
});
