export interface SearchHit {
  entryId: string
  entryType: string
  fieldPath: string
  /**
   * Relevance of the hit; only meaningful for ordering hits of the same search.
   */
  score: number
  /**
   * Excerpt of the document text that best represents why the document matched.
   */
  snippet: string
}
