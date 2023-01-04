import test from 'ava'
import {FixtureGenerator} from "../src";

test('Will throw error with same keys', async t => {

    const generator = new FixtureGenerator([
        {
            key: 'dupeKey',
            type: 'type',
            fields: {
                bar: 'false'
            },
        },
        {
            key: 'dupeKey',
            type: 'type',
            fields: {
                bar: 'true'
            },
        },
        {
            key: 'normalKey',
            type: 'type',
            fields: {
                bar: 'true'
            },
        },
    ]);

    await t.throwsAsync(async () => {
        await generator.all()
    }, {
        message: 'Duplicate fixture keys found: dupeKey'
    })

})
