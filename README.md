# `@typescript-eslint/no-deprecated` misses `$store` reads of a deprecated store

```sh
npm install
npm run lint
```

## Versions

eslint 10.12.0 · eslint-plugin-svelte 3.23.1 · svelte-eslint-parser 1.9.0 ·
typescript-eslint 8.71.1 · typescript 6.0.3 · svelte 5.57.2

## What I did

`src/stores.ts` exports a store marked `/** @deprecated */`. `src/App.svelte`
uses it three ways: `legacyCount.set(1)`, `$legacyCount` in the script, and
`{$legacyCount}` in the template.

## What I expected

`@typescript-eslint/no-deprecated` to report all three, as the editor
(svelte-language-server) does.

## What happened

Only `legacyCount.set(1)` is reported:

```
src/App.svelte
  5:2  error  `legacyCount` is deprecated. Use `count` instead  @typescript-eslint/no-deprecated
```

A component that only reads the store through `$legacyCount` (the usual case,
e.g. `$page` from SvelteKit's deprecated `$app/stores`) gets nothing, and
no-deprecated doesn't report imports, so the deprecation never surfaces in CI.

## Why

In the virtual TypeScript code, svelte-eslint-parser gives each `$store` a
declaration of its own: `declare let $legacyCount: StoreValueType<typeof legacyCount>`.
no-deprecated asks the checker about the `$legacyCount` symbol, which isn't
deprecated. ESLint's scope does resolve `$legacyCount` to `legacyCount`
(analyzeStoreScope), but the TypeScript side doesn't.

Store types themselves are fine: `$legacyCount` is typed `number`.

## Related

- sveltejs/eslint-plugin-svelte#1384: the same request, closed by pointing at
  no-deprecated; the later comment there says no-deprecated doesn't catch it.

## Possible fixes

- An extension rule in eslint-plugin-svelte (like its
  `@typescript-eslint/no-unnecessary-condition` one) that also checks, for a
  `$name` reference, whether `name` is deprecated.
- Or the parser carrying the store's deprecation over to the virtual `$name`
  declaration.
