# db-fixture-generator

A database and framework-agnostic fixture generator for NodeJS

This project is not yet stable, do not use it in production.

## TODO
 * Solve Dependency Graph
 * Load Relationships
 * Handle Arrays
 * Settle internal api

## Features

* Solves your fixtures dependency tree, creating entities in order as needed.
* Supports CommonJS + ESM
* Supports YAML + JSON for fixtures

## Usage

Create a file such as seed.ts

```ts
(async () => {
    const options = {};
    const fixtures = await FixtureGenerator.fromFiles('./fixtures/**.yaml', options);
    
    await fixtures.create(async (entityType, data) => {
        // persist data here
    });
})();
```

Run it

```shell
ts-node seed.ts
```

### Examples - TypeORM
### Examples - Prisma