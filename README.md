# Introduction

[Commitspark](https://commitspark.com) is a set of tools to manage structured data with Git
through a GraphQL API.

This package provides interfaces that abstract away concrete search implementations from
the [Commitspark GraphQL API](https://github.com/commitspark/graphql-api) implementation. Use these interfaces
to build a custom search implementation, e.g. based on keyword search, semantic search or a combination of both.

# How searching works

The Commitspark GraphQL API extracts the values of all fields marked with directive `@Searchable` from all entries of
a commit and hands these to a search adapter as `SearchableFieldValue` objects, one per value (i.e. one per item for
list fields). Each search request carries the hash of the commit to search in. As the values of a commit never change,
adapters can build an index once per commit hash and reuse it for all subsequent requests. Values are only retrieved
from the Commitspark GraphQL API when an adapter calls `getSearchableFieldValues()` of a request.

Values of a new commit are mostly identical to those of commits already indexed. Adapters with costly indexing (e.g.
computing embeddings) should therefore cache their per-value results keyed by a hash of the value (and, where
applicable, of the embedding model), so that only new or changed values need to be processed.

# Example

Given the following schema and entry:

```graphql
directive @Entry on OBJECT
directive @Searchable on OBJECT | FIELD_DEFINITION

type Article @Entry {
    id: ID!
    title: String @Searchable
    tags: [String!] @Searchable
    blocks: [Block!]
}

union Block = TextBlock | ImageBlock

type TextBlock @Searchable {
    body: String
}

type ImageBlock {
    url: String
}
```

```yaml
# commitspark/entries/first-launch.yaml
metadata:
  type: Article
data:
  title: First launch
  tags:
    - rocket
    - orbit
  blocks:
    - TextBlock:
        body: The rocket lifted off at dawn.
    - ImageBlock:
        url: https://example.com/launch.jpg
```

`getSearchableFieldValues()` returns one `SearchableFieldValue` per value. For values within a union, the field path
contains the concrete union member type, matching the structure of the stored entry data:

```typescript
[
  { entryId: 'first-launch', entryType: 'Article', fieldPath: 'title', value: 'First launch' },
  { entryId: 'first-launch', entryType: 'Article', fieldPath: 'tags[0]', value: 'rocket' },
  { entryId: 'first-launch', entryType: 'Article', fieldPath: 'tags[1]', value: 'orbit' },
  {
    entryId: 'first-launch',
    entryType: 'Article',
    fieldPath: 'blocks[0].TextBlock.body',
    value: 'The rocket lifted off at dawn.',
  },
]
```

An adapter receives a `SearchRequest` and returns `SearchHit` objects that refer back to the matching values by
`entryId`, `entryType` and `fieldPath`. If an adapter keeps an index per commit, it should only call
`getSearchableFieldValues()` for commits it has not indexed yet. The following minimal adapter illustrates this with a
case-insensitive substring match. An actual implementation should rank hits by relevance, use a suitable search index,
and limit the number of indexes it keeps.

```typescript
import {
  SearchableFieldValue,
  SearchAdapter,
  SearchHit,
  SearchRequest,
} from '@commitspark/search-adapter'

export function createAdapter(): SearchAdapter {
  const valuesByCommitHash = new Map<string, SearchableFieldValue[]>()

  return {
    async search(request: SearchRequest): Promise<SearchHit[]> {
      let values = valuesByCommitHash.get(request.commitHash)
      if (values === undefined) {
        values = await request.getSearchableFieldValues()
        valuesByCommitHash.set(request.commitHash, values)
      }

      const query = request.query.toLowerCase()
      return values
        .filter(
          (value) =>
            request.entryTypes === undefined ||
            request.entryTypes.includes(value.entryType),
        )
        .filter((value) => value.value.toLowerCase().includes(query))
        .slice(0, request.limit)
        .map((value) => ({
          entryId: value.entryId,
          entryType: value.entryType,
          fieldPath: value.fieldPath,
          score: 1,
          snippet: value.value.slice(0, 200),
        }))
    },
  }
}
```

A search for `rocket` then yields hits for `tags[0]` and `blocks[0].TextBlock.body` of entry `first-launch`.

# Adapter Conventions

The following conventions should be applied in adapter implementations:

* **Ranking**: Hits should be returned ordered by descending relevance and limited to the requested number of hits.
* **Filtering**: If a request specifies entry types, only hits of entries of these types should be returned.
* **Snippets**: Snippets should be short excerpts of the value, not the full text of long values.
* **Errors**: Adapters should throw known errors using the `SearchAdapterError` class with one of the predefined
  `ErrorCode` values so that callers are able to handle errors meaningfully.

# License

The code in this repository is licensed under the permissive ISC license (see [LICENSE](LICENSE)).
