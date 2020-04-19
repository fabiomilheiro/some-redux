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
    beforeEach(() => {
      store = configureStore();
    });

    it("shows the loading indicator while loading", () => {
      store.dispatch(bugs.actions.load());

      expect(getBugs().isLoading).toBe(true);
    });

    it("loads the bugs if no cache", async () => {
      await store.dispatch(bugs.actions.load());

      expect(getBugs().list).toEqual(bugsOnServer);
      expect(getBugs().isLoading).toBe(false);
    });

    it("does not load the new bugs if cached", async () => {
      await store.dispatch(bugs.actions.load());
      const newBug = { id: 123456 };
      bugsOnServer.push(newBug);

      await store.dispatch(bugs.actions.load());

      expect(getBugs().list).not.toContainEqual(newBug);
      expect(getBugs().isLoading).toBe(false);
    });

    it("hides the loading indicator on error", async () => {
      axiosMock.onGet("/bugs").replyOnce(500);

      await store.dispatch(bugs.actions.load());

      expect(getBugs().isLoading).toBe(false);
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
    it("Gets unresolved bugs", async () => {
      const state = createStateWithBugList([
        { id: 1, resolved: false },
        { id: 2, resolved: true },
        { id: 3, resolved: true },
        { id: 4 },
      ]);

      const result = bugs.selectors.getUnresolvedBugs(state);

      expect(result).toEqual([{ id: 1, resolved: false }, { id: 4 }]);
    });

    it("Gets bugs by user", () => {
      const state = createStateWithBugList([
        { id: 1, resolved: false, userId: 1 },
        { id: 2, resolved: true, userId: 1 },
        { id: 3, resolved: true, userId: 2 },
        { id: 4 },
      ]);

      const result = bugs.selectors.getBugsByUser(1)(state);

      expect(result).toEqual([
        { id: 1, resolved: false, userId: 1 },
        { id: 2, resolved: true, userId: 1 },
      ]);
    });
  });

  function createStateWithBugList(list) {
    return {
      entities: {
        bugs: {
          list: list,
        },
      },
    };
  }

  function getBug(id) {
    return getBugs().list.find((b) => b.id === id);
  }

  function getBugs() {
    return store.getState().entities.bugs;
  }
});
