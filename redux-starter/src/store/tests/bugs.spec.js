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
    it("Loads the bugs on success", async () => {
      await store.dispatch(bugs.actions.loadBugs());

      expect(getBugs().list).toEqual(bugsOnServer);
      expect(getBugs().isLoading).toEqual(false);
    });
  });

  describe("Add bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.loadBugs());
    });

    it("Updates state on success", async () => {
      const newBug = await store.dispatch(bugs.actions.addBug("New bug"));

      expect(getBugs().list).toContainEqual(newBug);
    });

    it("It does not update state on failure", async () => {
      axiosMock = new MockAdapter(axios);
      axiosMock.onPost().reply(500, {});
      const previousBugList = [...getBugs().list];

      await store.dispatch(bugs.actions.addBug("Bug x"));

      expect(getBugs().list).toEqual(previousBugList);
    });
  });

  function getBugs() {
    return store.getState().entities.bugs;
  }
});
