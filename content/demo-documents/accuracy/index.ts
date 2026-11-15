import { cleanSets } from "./clean-sets";
import { mistakeSetsA } from "./mistake-sets-a";
import { mistakeSetsB } from "./mistake-sets-b";
import { trickySets } from "./tricky-sets";

export type { CheckGroup, CheckSet } from "./paper";

// Extra labelled sets used only to measure the rules (docs/economics/accuracy.md).
// They are not shown in the product; the "try a sample" button uses `demoSets`.
export const checkSets = [...cleanSets, ...trickySets, ...mistakeSetsA, ...mistakeSetsB];
