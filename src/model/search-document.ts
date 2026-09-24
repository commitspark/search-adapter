/**
 * Searchable text of a single field value of an entry.
 */
export interface SearchDocument {
  entryId: string
  entryType: string
  /**
   * Location of the text within the entry's data, e.g. `title`, `seo.description` or `sections[2].body`.
   */
  fieldPath: string
  text: string
}
