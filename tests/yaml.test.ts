import test from 'ava'
import {FixtureGenerator} from "../src/index.js";

test('Can generate fixtures from YAML', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/blog/**.yaml');

    const entities: any[] = await generator.all();

    const tyler = entities.find((e) => e.name === 'Tyler Getsay');
    const post = entities.find((e) => e.title === 'Post Title');

    t.truthy(tyler);
    t.is(entities.length, 4);
    t.is(post.user.id, '1')

})
