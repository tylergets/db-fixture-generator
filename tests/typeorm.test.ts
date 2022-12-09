import test from 'ava'
import FixtureGenerator from "../src";

test('Can generate fixtures compatible with TypeORM', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/blog/**.yaml', {
        formatRelationship: (entityType, entityData) => {
            return {
                id: entityData.id,
                'typeorm': true
            }
        }
    });

    const entities = [];

    await generator.create((entityType, entityData) => {
        entities.push(entityData);
    })

    t.is(entities.length, 4);

    const tyler = entities.find((e) => e.name === 'Tyler Getsay');

    t.truthy(tyler);
    t.is(tyler.id, '1');

})
