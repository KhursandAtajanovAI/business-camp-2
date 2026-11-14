import { expect, test } from "vitest";
import { findFirstDate, parseUsDate } from "./read-date";

test("US dates become ISO dates", () => {
  expect(parseUsDate("03/14/2026")).toBe("2026-03-14");
  expect(parseUsDate("3/4/26")).toBe("2026-03-04");
  expect(parseUsDate("2026-03-14")).toBe("2026-03-14");
  expect(parseUsDate("March 21, 2026")).toBe("2026-03-21");
});

test("something that is not a date gives nothing", () => {
  expect(parseUsDate("13/45/2026")).toBeNull();
  expect(parseUsDate("soon")).toBeNull();
});

test("the first date in a sentence is found", () => {
  expect(findFirstDate("Statement date: 03/20/2026, due 04/20/2026")).toBe("2026-03-20");
});
