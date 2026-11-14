import { set1 } from "./set-1-hospital-and-eob";
import { set2 } from "./set-2-obstetrician-package";
import { set3 } from "./set-3-mother-and-baby";
import { set4 } from "./set-4-out-of-network";
import { set5 } from "./set-5-full-case-file";

export type { DemoSet, PlantedMistake } from "./types";

// Five synthetic family stories. All invented, all marked SAMPLE.
export const demoSets = [set1, set2, set3, set4, set5];
