import { expect, test } from "vitest";
import { readPastedText } from "./read-pasted-text";

test("pasted text with amounts is accepted and tidied", () => {
  expect(readPastedText("  Room and board $2,400.00\r\nTotal $2,400.00 ")).toBe("Room and board $2,400.00\nTotal $2,400.00");
});

test("too little text gets a kind message", () => {
  expect(() => readPastedText("hello")).toThrow(/not quite enough/);
});

test("text without amounts gets a kind message", () => {
  expect(() => readPastedText("This is my hospital bill but without any numbers")).toThrow(/dollar amounts/);
});
