import { callScript } from "@content/letters/call-script";
import { fillTemplate } from "../shared/fill-template";
import { formatDate, formatMoney } from "../shared/format";
import type { FindingGroup } from "../shared/group-findings";

function section(title: string, lines: string[]): string {
  return [title, ...lines.map((line) => `- ${line}`)].join("\n");
}

// One script per billing office, in the order a call really goes.
export function buildCallScript(groups: FindingGroup[]): string {
  return groups
    .map(({ document, findings }) => {
      const count = findings.length === 1 ? callScript.oneCharge : fillTemplate(callScript.manyCharges, { count: findings.length });
      const values = { provider: document.provider, issuedOn: formatDate(document.issuedOn) || "______", count };
      const say = [
        fillTemplate(callScript.sayOpening, values),
        ...findings.map((finding, index) =>
          fillTemplate(callScript.sayFinding, { number: index + 1, title: finding.title, amount: formatMoney(finding.atStakeCents) }),
        ),
        callScript.sayHold,
      ];
      return [
        `CALL TO: ${document.provider}`,
        section(callScript.beforeTitle, callScript.before.map((line) => fillTemplate(line, values))),
        section(callScript.sayTitle, say),
        section(callScript.writeTitle, callScript.write),
        section(callScript.askTitle, callScript.ask),
        section(callScript.ifNoTitle, callScript.ifNo),
      ].join("\n\n");
    })
    .join("\n\n----------\n\n");
}
