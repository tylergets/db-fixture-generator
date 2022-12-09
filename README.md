# db-fixture-generator

A database and framework agnostic fixture generator for NodeJS

## Features

* Solves your fixtures dependency tree, creating entities in order as needed.
* Supports CommonJS + ESM
* Supports YAML + JSON for fixtures

## Usage

Create a file such as seed.ts

```ts
(() => {
    const options = {};
    const fixtures = FixtureGenerator.fromFiles('./fixtures/**.yaml', options);
    
    fixtures.create((entityType, data) => {
        // persist data here
    });
})();
```

Run it

```shell
ts-node seed.ts
```
