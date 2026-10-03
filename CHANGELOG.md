# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Publish separate type declarations for the ESM and CJS builds and reference them per condition in `exports` of
  `package.json`, so that TypeScript projects that import this package from ESM code with `moduleResolution` set to
  `node16` or `nodenext` receive correct types. Type declarations are no longer located in `dist/types`.

## [1.0.0-beta.1] - 2026-09-24

### Added

- Initial release
