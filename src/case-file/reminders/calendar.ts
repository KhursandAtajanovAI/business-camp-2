import type { CaseFile } from "@/contracts";
import { caseFileText } from "@content/letters/case-file";
import { addDays } from "../store/dates";

const compact = (isoDay: string) => isoDay.replace(/-/g, "");

// Calendar files treat commas, semicolons and line breaks as special, so they are escaped.
const escapeText = (text: string) => text.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

// One all-day entry per open deadline, in the standard iCalendar format
// that Google Calendar, Apple Calendar and Outlook all open.
export function buildCalendarFile(caseFile: CaseFile, now: Date = new Date()): string {
  const stamp = `${now.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
  const events = caseFile.deadlines
    .filter((deadline) => !deadline.done)
    .flatMap((deadline, index) => [
      "BEGIN:VEVENT",
      `UID:${caseFile.id}-${index}-${compact(deadline.dueOn)}@birth-bill-check`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(deadline.dueOn)}`,
      `DTEND;VALUE=DATE:${compact(addDays(deadline.dueOn, 1))}`,
      `SUMMARY:${escapeText(deadline.label)}`,
      `DESCRIPTION:${escapeText(caseFileText.calendarDescription)}`,
      "END:VEVENT",
    ]);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Birth bill check//Case reminders//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"];
  return `${lines.join("\r\n")}\r\n`;
}

// A link the browser can download as "case-reminders.ics" without any server.
export function calendarFileUrl(caseFile: CaseFile, now: Date = new Date()): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildCalendarFile(caseFile, now))}`;
}
