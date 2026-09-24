import { SearchDocument } from './search-document.ts'

export interface SearchRequest {
  /**
   * Commit whose documents are searched. Documents of a commit never change, so indexes can be cached per commit hash.
   */
  commitHash: string
  query: string
  /**
   * If set, only documents of entries of these types are to be returned.
   */
  entryTypes?: string[]
  /**
   * Maximum number of hits to return.
   */
  limit: number
  /**
   * Returns all searchable documents of the commit. Only needs to be called if no index exists yet for the commit.
   */
  getDocuments(): Promise<SearchDocument[]>
}
