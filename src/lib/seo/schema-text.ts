/** Plain text for JSON-LD. Strips markup the same way the LMS schema builders do. */
export function stripSchemaText(value: string, maxLen?: number): string {
  const plain = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (maxLen === undefined || plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen - 1)}…`;
}
