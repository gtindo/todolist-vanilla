/**
 *
 * @param {string} date
 * @returns
 */
export function toDateString(date) {
  return new Date(date).toISOString().split("T")[0];
}
