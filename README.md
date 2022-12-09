# db-fixture-generator

A database and framework-agnostic fixture generator for NodeJS

This project is not yet stable, do not use it in production.

## TODO
 * Settle internal api + yaml format
 * Ability to call methods (sync/async)
 * Basic math operations in output

## Features

* Solves your fixtures dependency tree, creating entities in order as needed.
* Supports CommonJS + ESM
* Supports YAML + JSON for fixtures

## Usage

Create a file such as seed.ts

```ts
import FixtureGenerator from "db-fixture-generator";

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
```ts
import FixtureGenerator from "db-fixture-generator";

(async () => {

    await dataSource.initialize();
    
    const fixtures = await FixtureGenerator.fromFiles('./fixtures/**.yaml', {
        formatRelationship: (entityType, entityData) => {
            return {
                id: entityData.id
            }
        }
    });

    await fixtures.create(async (entityType, entityKey, data) => {
        const repository = dataSource.getRepository(entityType);
        const created = repository.create(data);
        await repository.save(created);

        console.log(`Created ${entityType} of key ${entityKey}`);
    });
})();
```

### Examples - Prisma

```ts
import FixtureGenerator from "db-fixture-generator";
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

    await fixtures.create(async (entityType, entityKey, data) => {
        await prisma[entityType].create(data);
    });
})();
```
