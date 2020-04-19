import { isEven } from "./math";

it("return true if even", () => {
  expect(isEven(2)).toEqual(true);
});

it("return true if odd", () => {
  expect(isEven(3)).toEqual(false);
});
