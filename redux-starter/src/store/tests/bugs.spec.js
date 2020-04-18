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

      if (patchData.userId !== undefined) {
        bug.userId = patchData.userId;
      }

      return [200, bug];
    });
  });

  // describe("Load bugs", () => {
  //   it("loads the bugs on success", async () => {
  //     await store.dispatch(bugs.actions.loadBugs());

  //     expect(getBugs().list).toEqual(bugsOnServer);
  //     expect(getBugs().isLoading).toEqual(false);
  //   });
  // });

  // describe("Add bug", () => {
  //   beforeEach(async () => {
  //     await store.dispatch(bugs.actions.loadBugs());
  //   });

  //   it("updates state on success", async () => {
  //     const newBug = await store.dispatch(bugs.actions.addBug("New bug"));

  //     expect(getBugs().list).toContainEqual(newBug);
  //   });

  //   it("does not update state on failure", async () => {
  //     axiosMock = new MockAdapter(axios);
  //     axiosMock.onPost().reply(500, {});
  //     const previousBugList = [...getBugs().list];

  //     await store.dispatch(bugs.actions.addBug("Bug x"));

  //     expect(getBugs().list).toEqual(previousBugList);
  //   });
  // });

  describe("Resolve bug", () => {
    beforeEach(async () => {
      await store.dispatch(bugs.actions.loadBugs());
    });

    it("sets the bug as resolved", async () => {
      const bug = getBugs().list[0];

      await store.dispatch(bugs.actions.resolveBug(bug.id));

      const updated = getBugs().list.find((b) => b.id === bug.id);
      console.log(updated);
      expect(updated.resolved).toEqual(true);
    });
  });

  function getBugs() {
    return store.getState().entities.bugs;
  }
});
