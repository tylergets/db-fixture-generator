import test from 'ava'
import FixtureGenerator from "../src";

test.serial('Entities are created in the proper order according to their relationships', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/graph_test/**.yaml');

    const entities: any[] = [];

    await generator.create((entityType, entityData) => {
        entities.push(entityData);
    })

    t.is(entities.length, 4);
    t.is(entities[0].__type, 'User');
    t.is(entities[1].__type, 'Post');
    t.is(entities[2].__type, 'User');
    t.is(entities[3].__type, 'Comment');

})