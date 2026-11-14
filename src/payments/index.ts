// STUB (stage 0): nobody has paid and checkout goes nowhere. Real payments arrive in stage 2.
import type { Plan } from "@/contracts";

export async function startCheckout(_plan: Plan): Promise<string> {
  return "/";
}

export function hasPaid(): boolean {
  return false;
}
