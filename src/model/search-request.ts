import { SearchableFieldValue } from './searchable-field-value.ts'

export interface SearchRequest {
  /**
   * Commit whose searchable field values are searched. Values of a commit never change, so indexes can be cached per
   * commit hash.
   */
  commitHash: string
  query: string
  /**
   * If set, only hits of entries of these types are to be returned.
   */
  entryTypes?: string[]
  /**
   * Maximum number of hits to return.
   */
  limit: number
  /**
   * Returns all searchable field values of the commit. Only needs to be called if no index exists yet for the commit.
   */
  getSearchableFieldValues(): Promise<SearchableFieldValue[]>
}
