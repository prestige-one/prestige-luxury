/** Prefer prefix matches, then other matches. Bound the list to avoid a large popup. */
export function locationSuggestions(options: string[], query: string, limit = 8): string[] {
  const term = query.trim().toLowerCase();
  const result: string[] = [];
  for (const option of options) {
    if (option.toLowerCase().startsWith(term)) result.push(option);
    if (result.length >= limit) return result;
  }
  if (term) for (const option of options) {
    const value = option.toLowerCase();
    if (!value.startsWith(term) && value.includes(term)) result.push(option);
    if (result.length >= limit) break;
  }
  return result;
}
