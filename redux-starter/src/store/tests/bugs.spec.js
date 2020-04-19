import "regenerator-runtime/runtime";
import configureStore from "../configureStore";
import bugs from "../bugs";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("Bugs", () => {
  let bugCount = 10000;
  let store = null;
  let axiosMock = null;
  const bugsOnServer = [{ id: 1000, description: "Sample bug" }];

  beforeEach(() => {
    store = configureStore();
    axiosMock = new MockAdapter(axios);
    axiosMock.onGet(/\/bugs/).reply(200, bugsOnServer);
    axiosMock.onPost(/\/bugs/).reply((config) => {
      const newBug = { id: ++bugCount, ...JSON.parse(config.data) };
      bugsOnServer.push(newBug);
      return [200, newBug];
    });
    axiosMock.onPatch(/\/bugs\/\d+/).reply((config) => {
      const bug = bugsOnServer.find(
        (b) => b.id == /\/(?<id>\d+)/.exec(config.url).groups.id
      );
      const patchData = JSON.parse(config.data);

      if (patchData.resolved !== undefined) {
        bug.resolved = patchData.resolved;
      }

      bug.userId = patchData.userId || bug.userId;

      return [200, bug];
    });
  });

  describe("Load bugs", () => {
    it("loads the bugs on success", async () => {
      await store.dispatch(bugs.actions.load());

      expect(getBugs().list).toEqual(bugsOnServer);
      expect(getBugs().isLoading).toEqual(false);
    });
  });

  describe("Add bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.load());
    });

    it("updates state on success", async () => {
      const newBug = await store.dispatch(bugs.actions.add("New bug"));

      expect(getBugs().list).toContainEqual(newBug);
    });

    it("does not update state on failure", async () => {
      axiosMock = new MockAdapter(axios);
      axiosMock.onPost(/\/bugs/).reply(500);
      const previousBugList = [...getBugs().list];

      await store.dispatch(bugs.actions.add("Bug x"));

      expect(getBugs().list).toEqual(previousBugList);
    });
  });

  describe("Assign bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.load());
    });

    it("assigns user to the bug", async () => {
      const bug = getBugs().list[0];

      await store.dispatch(bugs.actions.assign(bug.id, 555));

      const updated = getBugs().list[0];
      expect(updated.userId).toEqual(555);
    });
  });

  describe("Resolve bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.load());
    });

    it("sets the bug as resolved if patched", async () => {
      const bug = getBugs().list[0];

      await store.dispatch(bugs.actions.resolve(bug.id));

      const updated = getBug(bug.id);
      expect(updated.resolved).toEqual(true);
    });

    it("leaves the bug as not resolved if not patched", async () => {
      const bug = await store.dispatch(bugs.actions.add("Bug A"));
      axiosMock.onPatch(/\/bugs\/\d+/).reply(500);

      await store.dispatch(bugs.actions.resolve(bug.id));

      const updated = getBug(bug.id);
      expect(updated.resolved).toBeFalsy();
    });
  });

  describe("selectors", () => {
    it("Get unresolved bugs", async () => {
      await store.dispatch(bugs.actions.add("A"));
      await store.dispatch(bugs.actions.add("B"));
      await store.dispatch(bugs.actions.add("C"));
      const bugA = getBugByDescription(store, "A");
      const bugB = getBugByDescription(store, "B");
      const bugC = getBugByDescription(store, "C");
      await store.dispatch(bugs.actions.resolve(bugA.id));

      const result = bugs.selectors.getUnresolvedBugs(store.getState());

      expect(result).not.toContain(bugA);
      expect(result).toContain(bugB);
      expect(result).toContain(bugC);
    });

    function getBugByDescription(store, description) {
      return store
        .getState()
        .entities.bugs.list.find((b) => b.description === description);
    }
  });

  function getBug(id) {
    return getBugs().list.find((b) => b.id === id);
  }

  function getBugs() {
    return store.getState().entities.bugs;
  }
});
