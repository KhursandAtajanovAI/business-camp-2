// Puts values into the {{places}} of a template from content/letters.
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (place, key: string) => (key in values ? String(values[key]) : place));
}
