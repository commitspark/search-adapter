# Introduction

[Commitspark](https://commitspark.com) is a set of tools to manage structured data with Git
through a GraphQL API.

This package provides interfaces that abstract away concrete search implementations from
the [Commitspark GraphQL API](https://github.com/commitspark/graphql-api) implementation. Use these interfaces
to build a custom search implementation, e.g. based on keyword search, semantic search or a combination of both.

# How searching works

The Commitspark GraphQL API extracts the text of all fields marked with directive `@Searchable` from all entries of a
commit and hands these to a search adapter as `SearchDocument` objects, one per field value. Each search request
carries the hash of the commit to search in. As the documents of a commit never change, adapters can build an index
once per commit hash and reuse it for all subsequent requests. Documents are only retrieved from the Commitspark
GraphQL API when an adapter calls `getDocuments()` of a request, i.e. when no index exists yet for the commit.

# Adapter Conventions

The following conventions should be applied in adapter implementations:

* **Ranking**: Hits should be returned ordered by descending relevance and limited to the requested number of hits.
* **Filtering**: If a request specifies entry types, only hits of documents of these entry types should be returned.
* **Snippets**: Snippets should be short excerpts of the document text, not the full text of long documents.
* **Errors**: Adapters should throw known errors using the `SearchAdapterError` class with one of the predefined
  `ErrorCode` values so that callers are able to handle errors meaningfully.

# License

The code in this repository is licensed under the permissive ISC license (see [LICENSE](LICENSE)).
