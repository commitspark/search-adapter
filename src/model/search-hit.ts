/**
 * Searchable field value matching a search query.
 */
export interface SearchHit {
  entryId: string
  entryType: string
  fieldPath: string
  /**
   * Relevance of the hit; only meaningful for ordering hits of the same search.
   */
  score: number
  /**
   * Excerpt of the field value that best represents why the value matched.
   */
  snippet: string
}
