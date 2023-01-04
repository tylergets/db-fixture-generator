import test from 'ava'
import {FixtureGenerator} from "../src";

test('Entities from YAML are created with the proper type, key, and ID', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/blog_advanced/**.yaml');

    const output = [];
    await generator.create(async (entityKey, entityType, entityData) => {
        output.push({entityType, entityData, entityKey});
    });

    t.is(output.length, 13);
    t.is(output[0].entityType, 'User');
    t.is(output[0].entityKey, 'poster');

    t.is(output[0].entityData.id, '1');
});

test('Entity can reference its own key', async t => {

    const generator = new FixtureGenerator([{
        key: 'ENTITY_KEY',
        type: 'ENTITY_TYPE',
        fields: {
            i: '{{i}}',
            myKey: '{{key}}',
            myType: '{{type}}'
        }
    }]);

    const output = await generator.all();

    t.is(output.length, 1);
    t.is(output[0].i, '1');
    t.is(output[0].myKey, 'ENTITY_KEY');
    t.is(output[0].myType, 'ENTITY_TYPE');
});