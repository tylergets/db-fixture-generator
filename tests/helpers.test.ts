import test from 'ava'
import {FixtureGenerator} from "../src";
import {faker} from "@faker-js/faker";

test('Can use global helpers', async t => {
    faker.seed(1);

    const generator = new FixtureGenerator([
        {
            type: 'vars',
            key: 'vars',
            fields: {
                foo: '{{#length}}1234{{/length}}'
            }
        }
    ], {
        helpers: {
            length: () => {
                return function(val, render) {
                    return val.length;
                }
            }
        }
    })

    const entities = await generator.all();

    t.is(entities[0].foo, '4');
})