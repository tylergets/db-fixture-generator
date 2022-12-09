import test from 'ava'
import {FixtureGenerator} from "../src";

test('Can return a boolean', async t => {

    const generator = new FixtureGenerator([
        {
            type: 'boolean',
            key: 'boolean',
            fields: {
                myField: true,
                falseField: false,
            }
        }
    ])

    const entities: any[] = await generator.all();

    t.is(entities[0].myField, true);
    t.is(entities[0].falseField, false);

})

test('Can return a integer', async t => {

    const generator = new FixtureGenerator([
        {
            type: 'int',
            key: 'int',
            fields: {
                myField: 123,
            }
        }
    ])

    const entities: any[] = await generator.all();

    t.is(entities[0].myField, 123);

})
