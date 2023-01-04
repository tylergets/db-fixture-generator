import test from 'ava'
import {FixtureGenerator} from "../src";

test.serial('Entities are created with the proper type', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/blog/**.yaml');
    const entities: any[] = await generator.all();

    t.is(entities.length, 4);
    t.is(entities[0]['__type'], 'User');
})
