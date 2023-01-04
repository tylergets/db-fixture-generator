import test from 'ava'
import {FixtureGenerator} from "../src";

test('The all method generates the entities same as create', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/blog_static/**.yaml');

    const all: any[] = await generator.all();
    const created: any[] = [];

    await generator.create((key, type, data) => {
        created.push(data);
    })

    t.is(all.length, created.length);
    t.deepEqual(all, created);


})
