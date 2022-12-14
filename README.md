# db-fixture-generator

A database and framework-agnostic fixture generator for NodeJS

This project is not yet stable, do not use it in production.

## TODO
 * Settle internal api + yaml format
 * Ability to call methods (sync/async)
 * Basic math operations in output
 * Ability to set seed for generation on faker

## Features

* Database agnostic -- Use any ORM you would like.
* Solves your fixtures dependency tree, creating entities in order as needed.
* Ability to generate thousands of models quickly
* Support for Mustache Templates
* Support for FakerJS values
* 100% Test Coverage
* Supports YAML fixtures
* Supports CommonJS + ESM

## Usage

Create a file such as seed.ts

```ts
import {FixtureGenerator} from "db-fixture-generator";

(async () => {

    const options = {};
    const fixtures = await FixtureGenerator.fromFiles('./fixtures/**.yaml', options);

    await fixtures.create(async (entityKey, entityType, entityData) => {
        // persist data here
    });
})();
```

Run it

```shell
ts-node seed.ts
```

### Examples - TypeORM
```ts
import {FixtureGenerator} from "db-fixture-generator";

(async () => {

    await dataSource.initialize();
    
    const fixtures = await FixtureGenerator.fromFiles('./fixtures/**.yaml', {
        formatRelationship: (entityType, entityData) => {
            return {
                id: entityData.id
            }
        }
    });

    await fixtures.create(async (entityKey, entityType, entityData) => {
        const repository = dataSource.getRepository(entityType);
        const created = repository.create(entityData);
        await repository.save(created);

        console.log(`Created ${entityType}`);
    });
})();
```

### Examples - Prisma

```ts
import {FixtureGenerator} from "db-fixture-generator";
import {PrismaClient} from "@prisma/client";

(async () => {

    const prisma = new PrismaClient();
    
    const fixtures = await FixtureGenerator.fromFiles('./fixtures/**.yaml', {
        formatRelationship: (entityType, entityData) => {
            return {
                connect: {
                    id: entityData.id
                }
            }
        }
    });

    await fixtures.create(async (entityKey, entityType, entityData) => {
        await prisma[entityType].create(entityData);
    });
})();
```

### Alternatives
 * https://github.com/RobinCK/typeorm-fixtures