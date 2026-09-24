import { SearchRequest } from './model/search-request.ts'
import { SearchHit } from './model/search-hit.ts'

export interface SearchAdapter {
  /**
   * Returns the documents best matching the request's query, ordered by descending relevance.
   */
  search(request: SearchRequest): Promise<SearchHit[]>
}
