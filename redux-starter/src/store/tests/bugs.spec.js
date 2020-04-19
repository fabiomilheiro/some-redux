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
      axiosMock.onPost().reply(500, {});
      const previousBugList = [...getBugs().list];

      await store.dispatch(bugs.actions.add("Bug x"));

      expect(getBugs().list).toEqual(previousBugList);
    });
  });

  describe("Assign bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.load());

      axiosMock.onPatch(/\/bugs\/\d+/).reply((config) => {
        const bug = bugsOnServer.find(
          (b) => b.id == /\/(?<id>\d+)/.exec(config.url).groups.id
        );
        const patchData = JSON.parse(config.data);
        bug.userId = patchData.userId || bug.userId;

        return [200, bug];
      });
    });

    it("assigns user to the bug", async () => {
      debugger;
      try {
        const bug = getBugs().list[0];

        await store.dispatch(bugs.actions.assign(bug.id, 555));

        const updated = getBugs().list[0];
        expect(updated.userId).toEqual(555);
      } catch (error) {
        const e = error;
        debugger;
      }
    });
  });

  describe("Resolve bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.load());

      axiosMock.onPatch(/\/bugs\/\d+/).reply((config) => {
        const bug = bugsOnServer.find(
          (b) => b.id == /\/(?<id>\d+)/.exec(config.url).groups.id
        );
        const patchData = JSON.parse(config.data);

        if (patchData.resolved !== undefined) {
          bug.resolved = patchData.resolved;
        }

        return [200, bug];
      });
    });

    it("sets the bug as resolved", async () => {
      const bug = getBugs().list[0];

      await store.dispatch(bugs.actions.resolve(bug.id));

      const updated = getBug(bug.id);
      expect(updated.resolved).toEqual(true);
    });
  });

  function getBug(id) {
    return getBugs().list.find((b) => b.id === id);
  }

  function getBugs() {
    return store.getState().entities.bugs;
  }
});
