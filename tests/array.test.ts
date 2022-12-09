import test from 'ava'
import FixtureGenerator from "../src";

test.serial('Entities can have array values', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/array/**.yaml');

    const entities: any[] = await generator.all();

    t.truthy(Array.isArray(entities[0].featureFlags));
})

test.serial('Entities can have array values with relationships', async t => {

    const generator = new FixtureGenerator([
        {
            type: 'parent',
            key: 'parent',
            fields: {
                id: '{{id}}',
                foo: 'bar'
            }
        },
        {
            type: 'child',
            key: 'child',
            fields: {
                id: '{{id}}',
                foo: 'bar',
                parents: [
                    '123',
                    '@parent'
                ]
            }
        }
    ], {
        formatRelationship: (entityType, entityData) => {
            return entityData.id;
        }
    })

    const entities: any[] = await generator.all();

    const child = entities.find((e) => e.__key === 'child');

    t.is(entities.length, 2);
    entities.forEach((e) => {
        t.is(e.foo, 'bar');
    })

    t.deepEqual(child.parents,['123','1'])

})
