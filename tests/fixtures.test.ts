import test from 'ava'
import {FixtureGenerator} from "../src/index.js";

test('Can generate a basic fixture', async t => {

    const generator = new FixtureGenerator( [
        {
            type: 'Test',
            key: 'test',
            fields: {
                'id': 1
            }
        }
    ])

    const entities: any[] = await generator.all();

    t.is(entities.length, 1);
    t.is(entities[0].id, 1);

})

test('Can generate a fixture with a unique ID', async t => {

    const generator = new FixtureGenerator( [
        {
            type: 'Test',
            key: 'test',
            fields: {
                'id': '{{id}}'
            }
        }
    ])

    const entities: any[] = await generator.all();

    t.is(entities.length, 1);
    t.is(entities[0].id, '1');

})
