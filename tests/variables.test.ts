import test from 'ava'
import FixtureGenerator from "../src";
import {faker} from "@faker-js/faker";

test('Can use global variables', async t => {
    faker.seed(1);

    const generator = new FixtureGenerator([
        {
            type: 'vars',
            key: 'vars',
            fields: {
                foo: '{{foo}}'
            }
        }
    ], {
        variables: {
            foo: 'bar'
        }
    })

    const entities = await generator.all();

    t.is(entities[0].foo, 'bar');
})