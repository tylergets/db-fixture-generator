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