import { expect, test } from "vitest";
import type { CaseFile } from "@/contracts";
import { sampleCaseFile } from "@/contracts/stubs";
import { buildCalendarFile, calendarFileUrl } from "./calendar";
import { getReminders } from "./reminders";

const caseFile: CaseFile = {
  ...sampleCaseFile,
  deadlines: [
    { label: "Look for a reply; call, if none", dueOn: "2026-04-20", done: false },
    { label: "Send the letter", dueOn: "2026-04-05", done: true },
    { label: "Call the billing office", dueOn: "2026-04-10", done: false },
  ],
};

test("open reminders come nearest first and finished ones are left out", () => {
  const reminders = getReminders(caseFile, "2026-04-08");
  expect(reminders.map((reminder) => reminder.label)).toEqual(["Call the billing office", "Look for a reply; call, if none"]);
  expect(reminders[0].message).toBe("In 2 days: Call the billing office.");
});

test("the words stay gentle whether a date is near, today or has passed", () => {
  expect(getReminders(caseFile, "2026-04-09")[0].message).toBe("Tomorrow: Call the billing office.");
  expect(getReminders(caseFile, "2026-04-10")[0]).toMatchObject({ when: "today", message: "Today is a good day for this: Call the billing office." });
  expect(getReminders(caseFile, "2026-04-15")[0]).toMatchObject({ when: "waiting", message: "Whenever you are ready: Call the billing office." });
});

test("no reminder uses words of pressure", () => {
  const all = ["2026-04-01", "2026-04-10", "2026-05-30"].flatMap((day) => getReminders(caseFile, day)).map((reminder) => reminder.message).join(" ");
  expect(all).not.toMatch(/overdue|urgent|late|hurry|last chance|expired|!/i);
});

test("the calendar file has one all-day entry per open deadline", () => {
  const file = buildCalendarFile(caseFile, new Date("2026-04-01T09:30:00Z"));
  expect(file.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
  expect(file.endsWith("END:VCALENDAR\r\n")).toBe(true);
  expect(file.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  expect(file).toContain("DTSTAMP:20260401T093000Z");
  expect(file).toContain("DTSTART;VALUE=DATE:20260410\r\nDTEND;VALUE=DATE:20260411");
  expect(file).toContain("SUMMARY:Look for a reply\\; call\\, if none");
  expect(file).not.toMatch(/overdue|urgent|hurry/i);
});

test("the calendar file comes as a download link", () => {
  const url = calendarFileUrl(caseFile, new Date("2026-04-01T09:30:00Z"));
  expect(url.startsWith("data:text/calendar;charset=utf-8,BEGIN%3AVCALENDAR")).toBe(true);
});
