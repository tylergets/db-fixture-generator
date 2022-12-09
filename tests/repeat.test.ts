import test from 'ava'
import FixtureGenerator from "../src";

test.serial('Can create multiple entities', async t => {

    const generator = new FixtureGenerator([
        {
            key: 'comment',
            type: 'comment',
            repeat: 10,
            fields: {
                body: '{{ name.fullName }}',
                repeat: '{{r}}',
                total: '{{i}}',
            },
        },
        {
            key: 'user',
            type: 'user',
            fields: {
                name: 'Tyler'
            }
        }
    ]);

    const entities: any[] = await generator.all();

    t.is(entities.length, 11);

})

test.serial('Repeated entities can be referenced', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/array_relationship/**.yaml', {
        formatRelationship: (entityType, entityData) => {
            return entityData.id;
        }
    });
    const entities: any[] = await generator.all();

    t.is(entities.length, 11);
    t.is(entities[0].__key, 'child1');
    t.is(entities[1].__key, 'child2');
    t.is(entities[2].__key, 'location');

    t.is(entities[2].children.length, 2);
    t.is(entities[2].children[0], '1');
    t.is(entities[2].children[1], '2');

})
