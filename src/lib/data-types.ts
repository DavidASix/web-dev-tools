// A non-empty array, useful for working with zod schemas and enums.
export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(array: T[]): array is NonEmptyArray<T> {
  return array.length > 0;
}

/**
 * Converts a regular array to a NonEmptyArray.
 * Throws an error if the input array is empty.
 *
 * @param arr - The array to convert.
 * @returns A NonEmptyArray containing the elements of the input array.
 * @throws Error if the input array is empty.
 */
export function arrayToTuple<T>(arr: T[]): NonEmptyArray<T> {
  if (arr.length === 0) {
    throw new Error("Array must not be empty");
  }
  return arr as NonEmptyArray<T>;
}
