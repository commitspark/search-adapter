/**
 * String value of a field marked as searchable, together with its location in an entry.
 */
export interface SearchableFieldValue {
  entryId: string
  entryType: string
  /**
   * Location of the value within the entry's data, e.g. `title`, `seo.description`, `tags[1]` or, for values of
   * union types, `blocks[2].TextBlock.body`.
   */
  fieldPath: string
  value: string
}
